import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(
    request: NextRequest,
    { params }: { params: { ticketId: string } }
) {
    try {
        const { data: registration, error } = await supabaseAdmin
            .from('registrations')
            .select('*')
            .eq('ticket_id', params.ticketId)
            .eq('payment_status', 'PAID')
            .single();

        if (error || !registration) {
            return NextResponse.json(
                { error: 'Registration not found' },
                { status: 404 }
            );
        }

        // Fetch event details
        const { data: events } = await supabaseAdmin
            .from('events')
            .select('id, name, category, event_date, venue')
            .in('id', registration.event_ids);

        return NextResponse.json({
            registration,
            events: events || [],
        });
    } catch (err) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
