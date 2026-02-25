import { z } from 'zod';

export const registrationSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters')
        .regex(/^[a-zA-Z\s.'-]+$/, 'Name contains invalid characters'),
    email: z
        .string()
        .email('Invalid email address')
        .max(255, 'Email must be less than 255 characters'),
    phone: z
        .string()
        .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
    college: z
        .string()
        .min(2, 'College name must be at least 2 characters')
        .max(200, 'College name must be less than 200 characters'),
    year: z
        .string()
        .min(1, 'Please select your year'),
    department: z
        .string()
        .min(1, 'Please enter your department')
        .max(100, 'Department must be less than 100 characters'),
    event_ids: z
        .array(z.string().uuid('Invalid event ID'))
        .min(1, 'Select at least one event')
        .max(12, 'Cannot select more than 12 events'),
});

export const paymentVerificationSchema = z.object({
    razorpay_order_id: z.string().min(1, 'Order ID is required'),
    razorpay_payment_id: z.string().min(1, 'Payment ID is required'),
    razorpay_signature: z.string().min(1, 'Signature is required'),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
export type PaymentVerificationInput = z.infer<typeof paymentVerificationSchema>;
