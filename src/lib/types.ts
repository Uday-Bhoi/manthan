export interface Event {
    id: string;
    name: string;
    slug: string;
    description: string;
    category: 'technical' | 'cultural' | 'sports';
    fee: number; // in paise
    max_participants: number;
    current_participants: number;
    event_date: string;
    venue: string;
    rules: string[];
    image_url: string | null;
    is_active: boolean;
    team_size: number;
    created_at: string;
}

export interface Registration {
    id: string;
    ticket_id: string;
    name: string;
    email: string;
    phone: string;
    college: string;
    year: string | null;
    department: string | null;
    event_ids: string[];
    total_amount: number; // in paise
    payment_status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
    razorpay_order_id: string | null;
    razorpay_payment_id: string | null;
    razorpay_signature: string | null;
    checked_in: boolean;
    checked_in_at: string | null;
    checked_in_by: string | null;
    qr_code: string | null;
    created_at: string;
    updated_at: string;
}

export interface RegistrationFormData {
    name: string;
    email: string;
    phone: string;
    college: string;
    year: string;
    department: string;
    event_ids: string[];
}

export interface RazorpayOrder {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
}

export interface PaymentVerification {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

export interface AdminUser {
    id: string;
    email: string;
    role: 'admin' | 'staff';
    name: string | null;
    created_at: string;
}
