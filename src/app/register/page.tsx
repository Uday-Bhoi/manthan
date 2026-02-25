'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EventCard from '@/components/EventCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Event, RegistrationFormData } from '@/lib/types';
import { formatFee } from '@/lib/constants';
import { ShieldCheck, CreditCard, AlertTriangle } from 'lucide-react';

declare global {
    interface Window {
        Razorpay: any;
    }
}

const yearOptions = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'PG 1st Year', 'PG 2nd Year'];

export default function RegisterPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>}>
            <RegisterPageContent />
        </Suspense>
    );
}

function RegisterPageContent() {
    const searchParams = useSearchParams();
    const preselectedEvent = searchParams.get('event');

    const [step, setStep] = useState(1); // 1: Select Events, 2: Fill Details, 3: Payment
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState<string[]>(preselectedEvent ? [preselectedEvent] : []);
    const [formData, setFormData] = useState<RegistrationFormData>({
        name: '',
        email: '',
        phone: '',
        college: '',
        year: '',
        department: '',
        event_ids: [],
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState('');

    // Fetch events
    useEffect(() => {
        async function fetchEvents() {
            try {
                const res = await fetch('/api/events');
                const data = await res.json();
                setEvents(data.events || []);
            } catch {
                console.error('Failed to fetch events');
            } finally {
                setLoading(false);
            }
        }
        fetchEvents();
    }, []);

    // Load Razorpay script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    // Toggle event selection
    const toggleEvent = useCallback((id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    }, []);

    // Calculate total (client-side preview only - actual total calculated server-side)
    const previewTotal = events
        .filter((e) => selectedIds.includes(e.id))
        .reduce((sum, e) => sum + e.fee, 0);

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name || formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Enter a valid email address';
        }
        if (!formData.phone || !/^[6-9]\d{9}$/.test(formData.phone)) {
            newErrors.phone = 'Enter a valid 10-digit mobile number';
        }
        if (!formData.college || formData.college.trim().length < 2) {
            newErrors.college = 'College name is required';
        }
        if (!formData.year) {
            newErrors.year = 'Select your year';
        }
        if (!formData.department || formData.department.trim().length < 1) {
            newErrors.department = 'Department is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Proceed to payment
    const handlePayment = async () => {
        if (!validateForm()) return;

        setProcessing(true);
        setPaymentError('');

        try {
            // Step 1: Create order on backend (amount calculated server-side)
            const orderRes = await fetch('/api/payment/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    event_ids: selectedIds,
                }),
            });

            const orderData = await orderRes.json();

            if (!orderRes.ok) {
                throw new Error(orderData.error || 'Failed to create order');
            }

            // Step 2: Open Razorpay checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderData.order.amount,
                currency: orderData.order.currency,
                name: 'Manthan 2026',
                description: `Registration for ${selectedIds.length} event(s)`,
                order_id: orderData.order.id,
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone,
                },
                theme: {
                    color: '#8B0000',
                    backdrop_color: 'rgba(10,10,10,0.9)',
                },
                handler: async function (response: any) {
                    // Step 3: Verify payment on backend
                    try {
                        const verifyRes = await fetch('/api/payment/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            }),
                        });

                        const verifyData = await verifyRes.json();

                        if (!verifyRes.ok) {
                            throw new Error(verifyData.error || 'Payment verification failed');
                        }

                        // Redirect to confirmation page
                        window.location.href = `/confirmation/${verifyData.ticket_id}`;
                    } catch (err: any) {
                        setPaymentError(err.message || 'Payment verification failed. Contact support.');
                        setProcessing(false);
                    }
                },
                modal: {
                    ondismiss: function () {
                        setProcessing(false);
                        setPaymentError('Payment was cancelled. You can try again.');
                    },
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.on('payment.failed', function (response: any) {
                setPaymentError(
                    `Payment failed: ${response.error.description}. Please try again.`
                );
                setProcessing(false);
            });
            razorpay.open();
        } catch (err: any) {
            setPaymentError(err.message || 'Something went wrong. Please try again.');
            setProcessing(false);
        }
    };

    const inputClass =
        'w-full px-4 py-3 rounded-lg bg-manthan-black/50 border border-manthan-gold/20 text-gray-200 text-sm focus:border-manthan-gold/50 focus:outline-none focus:ring-1 focus:ring-manthan-gold/30 transition-colors placeholder:text-gray-600';
    const labelClass = 'block text-sm text-gray-400 mb-1.5';
    const errorClass = 'text-manthan-crimson text-xs mt-1';

    if (loading) {
        return (
            <>
                <Navbar />
                <main className="pt-24 pb-16 min-h-screen flex items-center justify-center">
                    <LoadingSpinner size="lg" />
                </main>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 px-4 min-h-screen">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-gold-gradient mb-4">
                            Register
                        </h1>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Select your events, fill in your details, and proceed to secure payment.
                        </p>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-center gap-2 mb-10">
                        {[
                            { num: 1, label: 'Select Events' },
                            { num: 2, label: 'Your Details' },
                            { num: 3, label: 'Payment' },
                        ].map((s, i) => (
                            <div key={s.num} className="flex items-center">
                                <div
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${step >= s.num
                                            ? 'bg-manthan-gold/20 text-manthan-gold border border-manthan-gold/30'
                                            : 'bg-manthan-dark text-gray-500 border border-gray-700'
                                        }`}
                                >
                                    <span
                                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= s.num ? 'bg-manthan-gold text-manthan-black' : 'bg-gray-700 text-gray-400'
                                            }`}
                                    >
                                        {s.num}
                                    </span>
                                    <span className="hidden sm:inline">{s.label}</span>
                                </div>
                                {i < 2 && <div className={`w-8 h-px mx-1 ${step > s.num ? 'bg-manthan-gold/50' : 'bg-gray-700'}`} />}
                            </div>
                        ))}
                    </div>

                    {/* Step 1: Select Events */}
                    {step === 1 && (
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {events.map((event) => (
                                    <EventCard
                                        key={event.id}
                                        event={event}
                                        selectable
                                        selected={selectedIds.includes(event.id)}
                                        onToggle={toggleEvent}
                                    />
                                ))}
                            </div>

                            {/* Summary Bar */}
                            {selectedIds.length > 0 && (
                                <div className="sticky bottom-4 glass-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-manthan-gold/30 shadow-2xl shadow-manthan-black/50">
                                    <div>
                                        <span className="text-gray-400 text-sm">
                                            {selectedIds.length} event{selectedIds.length > 1 ? 's' : ''} selected
                                        </span>
                                        <span className="text-manthan-gold font-bold text-xl ml-4">
                                            {formatFee(previewTotal)}
                                        </span>
                                        <span className="text-gray-500 text-xs ml-2">(preview)</span>
                                    </div>
                                    <button
                                        onClick={() => setStep(2)}
                                        className="px-8 py-3 bg-gradient-to-r from-manthan-maroon to-manthan-crimson text-white font-semibold rounded-lg hover:from-manthan-crimson hover:to-manthan-maroon transition-all shadow-lg"
                                    >
                                        Continue to Details
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 2: Fill Details */}
                    {step === 2 && (
                        <div className="max-w-2xl mx-auto">
                            <div className="glass-card p-8">
                                <h2 className="font-heading text-2xl font-bold text-manthan-gold mb-6">
                                    Personal Details
                                </h2>

                                <div className="space-y-5">
                                    <div>
                                        <label className={labelClass}>Full Name *</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className={inputClass}
                                            placeholder="Enter your full name"
                                        />
                                        {errors.name && <p className={errorClass}>{errors.name}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className={labelClass}>Email *</label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className={inputClass}
                                                placeholder="your@email.com"
                                            />
                                            {errors.email && <p className={errorClass}>{errors.email}</p>}
                                        </div>
                                        <div>
                                            <label className={labelClass}>Phone *</label>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className={inputClass}
                                                placeholder="10-digit mobile number"
                                                maxLength={10}
                                            />
                                            {errors.phone && <p className={errorClass}>{errors.phone}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className={labelClass}>College Name *</label>
                                        <input
                                            type="text"
                                            value={formData.college}
                                            onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                                            className={inputClass}
                                            placeholder="Enter your college name"
                                        />
                                        {errors.college && <p className={errorClass}>{errors.college}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className={labelClass}>Year *</label>
                                            <select
                                                value={formData.year}
                                                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                                className={inputClass}
                                            >
                                                <option value="">Select Year</option>
                                                {yearOptions.map((y) => (
                                                    <option key={y} value={y}>
                                                        {y}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.year && <p className={errorClass}>{errors.year}</p>}
                                        </div>
                                        <div>
                                            <label className={labelClass}>Department *</label>
                                            <input
                                                type="text"
                                                value={formData.department}
                                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                                className={inputClass}
                                                placeholder="e.g., Computer Science"
                                            />
                                            {errors.department && <p className={errorClass}>{errors.department}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Selected Events Summary */}
                                <div className="mt-8 pt-6 border-t border-manthan-gold/10">
                                    <h3 className="text-manthan-gold font-semibold mb-3">Selected Events</h3>
                                    <ul className="space-y-2 mb-4">
                                        {events
                                            .filter((e) => selectedIds.includes(e.id))
                                            .map((e) => (
                                                <li key={e.id} className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-300">{e.name}</span>
                                                    <span className="text-manthan-gold">{formatFee(e.fee)}</span>
                                                </li>
                                            ))}
                                    </ul>
                                    <div className="flex items-center justify-between pt-3 border-t border-manthan-gold/10">
                                        <span className="text-gray-300 font-semibold">Total (preview)</span>
                                        <span className="text-manthan-gold font-bold text-xl">{formatFee(previewTotal)}</span>
                                    </div>
                                </div>

                                {/* Security Notice */}
                                <div className="mt-6 p-4 rounded-lg bg-manthan-gold/5 border border-manthan-gold/10 flex items-start gap-3">
                                    <ShieldCheck size={20} className="text-manthan-gold flex-shrink-0 mt-0.5" />
                                    <p className="text-gray-400 text-xs">
                                        Final amount is calculated securely on our server based on selected events.
                                        Payment is processed through Razorpay&apos;s secure gateway.
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-8 flex gap-4">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="px-6 py-3 border border-manthan-gold/30 text-manthan-gold font-semibold rounded-lg hover:bg-manthan-gold/10 transition-all"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (validateForm()) setStep(3);
                                        }}
                                        className="flex-1 py-3 bg-gradient-to-r from-manthan-maroon to-manthan-crimson text-white font-semibold rounded-lg hover:from-manthan-crimson hover:to-manthan-maroon transition-all shadow-lg"
                                    >
                                        Review & Pay
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Review & Pay */}
                    {step === 3 && (
                        <div className="max-w-2xl mx-auto">
                            <div className="glass-card p-8">
                                <h2 className="font-heading text-2xl font-bold text-manthan-gold mb-6">
                                    Review & Pay
                                </h2>

                                {/* Registration Summary */}
                                <div className="space-y-4 mb-6">
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div className="text-gray-500">Name</div>
                                        <div className="text-gray-200">{formData.name}</div>
                                        <div className="text-gray-500">Email</div>
                                        <div className="text-gray-200">{formData.email}</div>
                                        <div className="text-gray-500">Phone</div>
                                        <div className="text-gray-200">{formData.phone}</div>
                                        <div className="text-gray-500">College</div>
                                        <div className="text-gray-200">{formData.college}</div>
                                        <div className="text-gray-500">Year / Dept</div>
                                        <div className="text-gray-200">{formData.year} - {formData.department}</div>
                                    </div>
                                </div>

                                {/* Events */}
                                <div className="pt-4 border-t border-manthan-gold/10 mb-6">
                                    <h3 className="text-manthan-gold font-semibold mb-3">Events</h3>
                                    <ul className="space-y-2">
                                        {events
                                            .filter((e) => selectedIds.includes(e.id))
                                            .map((e) => (
                                                <li key={e.id} className="flex items-center justify-between text-sm p-2 rounded bg-manthan-black/30">
                                                    <span className="text-gray-300">{e.name}</span>
                                                    <span className="text-manthan-gold">{formatFee(e.fee)}</span>
                                                </li>
                                            ))}
                                    </ul>
                                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-manthan-gold/10">
                                        <span className="text-gray-200 font-bold">Total Amount</span>
                                        <span className="text-manthan-gold font-bold text-2xl">{formatFee(previewTotal)}</span>
                                    </div>
                                </div>

                                {/* Error */}
                                {paymentError && (
                                    <div className="p-4 rounded-lg bg-red-900/20 border border-red-500/20 flex items-start gap-3 mb-6">
                                        <AlertTriangle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                                        <p className="text-red-300 text-sm">{paymentError}</p>
                                    </div>
                                )}

                                {/* Payment Button */}
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setStep(2)}
                                        disabled={processing}
                                        className="px-6 py-3 border border-manthan-gold/30 text-manthan-gold font-semibold rounded-lg hover:bg-manthan-gold/10 transition-all disabled:opacity-50"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handlePayment}
                                        disabled={processing}
                                        className="flex-1 py-4 bg-gradient-to-r from-manthan-maroon to-manthan-crimson text-white font-bold rounded-lg hover:from-manthan-crimson hover:to-manthan-maroon transition-all shadow-xl shadow-manthan-maroon/30 flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {processing ? (
                                            <>
                                                <LoadingSpinner size="sm" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard size={20} />
                                                Pay {formatFee(previewTotal)}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
