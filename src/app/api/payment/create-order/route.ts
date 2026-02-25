import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { supabaseAdmin } from '@/lib/supabase/server';
import { registrationSchema } from '@/lib/validations';
import { generateTicketId, sanitizeInput } from '@/lib/constants';
import { checkRateLimit } from '@/lib/rate-limit';

function getRazorpay() {
    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID!,
        key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
}

export async function POST(request: NextRequest) {
    try {
        // Rate limiting
        const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
        const { allowed } = await checkRateLimit(ip, 'create-order');
        if (!allowed) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        }

        // Parse and validate input
        const body = await request.json();
        const validation = registrationSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { name, email, phone, college, year, department, event_ids } = validation.data;

        // Fetch events from database to calculate amount SERVER-SIDE
        const { data: events, error: eventsError } = await supabaseAdmin
            .from('events')
            .select('id, fee, name, category, is_active, max_participants, current_participants')
            .in('id', event_ids)
            .eq('is_active', true);

        if (eventsError || !events || events.length === 0) {
            return NextResponse.json(
                { error: 'Selected events not found or are no longer active' },
                { status: 400 }
            );
        }

        // Verify all selected events exist and are active
        if (events.length !== event_ids.length) {
            return NextResponse.json(
                { error: 'Some selected events are invalid or inactive' },
                { status: 400 }
            );
        }

        // Check capacity
        for (const event of events) {
            if (event.current_participants >= event.max_participants) {
                return NextResponse.json(
                    { error: `Event "${event.name}" is full. Please select a different event.` },
                    { status: 400 }
                );
            }
        }

        // Calculate total amount SERVER-SIDE (source of truth)
        const totalAmountPaise = events.reduce((sum, e) => sum + e.fee, 0);

        if (totalAmountPaise <= 0) {
            return NextResponse.json({ error: 'Invalid total amount' }, { status: 400 });
        }

        // Generate ticket ID
        const primaryCategory = events[0]?.category || 'gen';
        const ticketId = generateTicketId(primaryCategory);

        // Create Razorpay order
        const razorpay = getRazorpay();
        const order = await razorpay.orders.create({
            amount: totalAmountPaise,
            currency: 'INR',
            receipt: ticketId,
            notes: {
                ticket_id: ticketId,
                name: sanitizeInput(name),
                email: email,
                phone: phone,
                event_count: event_ids.length.toString(),
            },
        });

        // Store PENDING registration (not confirmed until payment verified)
        const { error: insertError } = await supabaseAdmin.from('registrations').insert({
            ticket_id: ticketId,
            name: sanitizeInput(name),
            email: email.toLowerCase().trim(),
            phone: phone.trim(),
            college: sanitizeInput(college),
            year,
            department: sanitizeInput(department),
            event_ids,
            total_amount: totalAmountPaise,
            payment_status: 'PENDING',
            razorpay_order_id: order.id,
        });

        if (insertError) {
            console.error('Failed to create registration:', insertError);
            return NextResponse.json(
                { error: 'Failed to create registration. Please try again.' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency,
            },
            ticket_id: ticketId,
        });
    } catch (err) {
        console.error('Create order error:', err);
        return NextResponse.json(
            { error: 'Internal server error. Please try again.' },
            { status: 500 }
        );
    }
}
