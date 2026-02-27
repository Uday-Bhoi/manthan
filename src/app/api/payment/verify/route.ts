import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import QRCode from 'qrcode';
import { supabaseAdmin } from '@/lib/supabase/server';
import { paymentVerificationSchema } from '@/lib/validations';
import { checkRateLimit } from '@/lib/rate-limit';

function getClientIp(request: NextRequest): string {
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim();
    }

    return request.headers.get('x-real-ip') || 'unknown';
}

export async function POST(request: NextRequest) {
    try {
        // Rate limiting
        const ip = getClientIp(request);
        const { allowed } = await checkRateLimit(ip, 'verify-payment');
        if (!allowed) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        }

        // Parse and validate input
        const body = await request.json();
        const validation = paymentVerificationSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid payment data', details: validation.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = validation.data;

        // CRITICAL: Verify Razorpay signature using HMAC SHA256
        if (!process.env.RAZORPAY_KEY_SECRET) {
            throw new Error('Razorpay secret is not configured');
        }

        const body_text = razorpay_order_id + '|' + razorpay_payment_id;
        const expected_signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body_text)
            .digest('hex');

        if (expected_signature !== razorpay_signature) {
            console.error('Payment signature verification failed', {
                order_id: razorpay_order_id,
                payment_id: razorpay_payment_id,
            });

            // Mark as failed
            await supabaseAdmin
                .from('registrations')
                .update({ payment_status: 'FAILED' })
                .eq('razorpay_order_id', razorpay_order_id);

            return NextResponse.json(
                { error: 'Payment verification failed. Signature mismatch.' },
                { status: 400 }
            );
        }

        // Find the pending registration
        const { data: registration, error: findError } = await supabaseAdmin
            .from('registrations')
            .select('*')
            .eq('razorpay_order_id', razorpay_order_id)
            .eq('payment_status', 'PENDING')
            .single();

        if (findError || !registration) {
            return NextResponse.json(
                { error: 'Registration not found or already processed.' },
                { status: 404 }
            );
        }

        const qrCodePromise = QRCode.toDataURL(registration.ticket_id, {
            width: 220,
            margin: 1,
            color: {
                dark: '#d4a837',
                light: '#0a0a0a',
            },
        });

        // Update registration: mark as PAID and store payment details first
        const { error: updateError } = await supabaseAdmin
            .from('registrations')
            .update({
                payment_status: 'PAID',
                razorpay_payment_id,
                razorpay_signature,
            })
            .eq('id', registration.id);

        if (updateError) {
            console.error('Failed to update registration:', updateError);
            return NextResponse.json(
                { error: 'Failed to confirm registration. Contact support with your payment ID.' },
                { status: 500 }
            );
        }

        try {
            const qrCodeDataUrl = await qrCodePromise;
            await supabaseAdmin
                .from('registrations')
                .update({ qr_code: qrCodeDataUrl })
                .eq('id', registration.id);
        } catch (qrError) {
            console.error('QR generation/update failed:', qrError);
        }

        return NextResponse.json({
            success: true,
            ticket_id: registration.ticket_id,
            message: 'Payment verified and registration confirmed!',
        });
    } catch (err) {
        console.error('Verify payment error:', err);
        return NextResponse.json(
            { error: 'Internal server error. Please contact support.' },
            { status: 500 }
        );
    }
}
