'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Registration, Event } from '@/lib/types';
import { formatFee, formatDate } from '@/lib/constants';
import { CheckCircle, Download, Calendar, MapPin, Ticket, User, Mail, Phone, Building } from 'lucide-react';

export default function ConfirmationPage() {
    const params = useParams();
    const ticketId = params.ticketId as string;
    const passRef = useRef<HTMLDivElement>(null);

    const [registration, setRegistration] = useState<Registration | null>(null);
    const [events, setEvents] = useState<Partial<Event>[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const teamRegistrationMap = new Map(
        (registration?.team_registrations || []).map((team) => [team.event_id, team])
    );

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`/api/registration/${ticketId}`);
                const data = await res.json();

                if (!res.ok) {
                    setError(data.error || 'Registration not found');
                    return;
                }

                setRegistration(data.registration);
                setEvents(data.events);
            } catch {
                setError('Failed to load registration details');
            } finally {
                setLoading(false);
            }
        }

        if (ticketId) fetchData();
    }, [ticketId]);

    const handleDownload = () => {
        // Create a printable version
        const printWindow = window.open('', '_blank');
        if (!printWindow || !passRef.current) return;

        printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Manthan 2026 - Entry Pass - ${registration?.ticket_id}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; background: #0a0a0a; color: #e0e0e0; padding: 20px; }
          .pass { max-width: 500px; margin: 0 auto; background: #1a0a0a; border: 2px solid #d4a837; border-radius: 16px; padding: 30px; }
          .header { text-align: center; border-bottom: 1px solid rgba(212,168,55,0.3); padding-bottom: 20px; margin-bottom: 20px; }
          .title { font-size: 28px; color: #d4a837; font-weight: bold; letter-spacing: 4px; }
          .subtitle { color: #DC143C; font-size: 14px; margin-top: 4px; }
          .ticket-id { font-size: 18px; color: #d4a837; font-weight: bold; margin: 15px 0; letter-spacing: 2px; }
          .qr { text-align: center; margin: 20px 0; }
          .qr img { width: 200px; height: 200px; }
          .details { margin: 15px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(212,168,55,0.1); font-size: 13px; }
          .detail-label { color: #888; }
          .detail-value { color: #e0e0e0; font-weight: 500; }
          .events-list { margin: 15px 0; }
          .event-item { padding: 8px 12px; background: rgba(212,168,55,0.05); border-left: 3px solid #d4a837; margin-bottom: 6px; font-size: 13px; border-radius: 0 6px 6px 0; }
          .total { text-align: right; font-size: 18px; color: #d4a837; font-weight: bold; margin-top: 10px; }
          .footer { text-align: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid rgba(212,168,55,0.3); color: #666; font-size: 11px; }
          .status { display: inline-block; padding: 4px 12px; background: rgba(0,128,0,0.2); color: #4ade80; border-radius: 20px; font-size: 12px; font-weight: 600; }
          @media print { body { background: white; color: black; } .pass { border-color: #333; background: white; } .title, .ticket-id, .total { color: #8B0000; } .detail-value { color: #333; } }
        </style>
      </head>
      <body>
        <div class="pass">
          <div class="header">
            <div class="title">MANTHAN</div>
            <div class="subtitle">2026 • College Tech Fest</div>
            <div class="ticket-id">${registration?.ticket_id}</div>
            <span class="status">✓ PAID</span>
          </div>
          <div class="qr">
            <img src="${registration?.qr_code}" alt="QR Code" />
            <div style="color:#888;font-size:11px;margin-top:5px;">Scan for entry verification</div>
          </div>
          <div class="details">
            <div class="detail-row"><span class="detail-label">Name</span><span class="detail-value">${registration?.name}</span></div>
            <div class="detail-row"><span class="detail-label">Email</span><span class="detail-value">${registration?.email}</span></div>
            <div class="detail-row"><span class="detail-label">Phone</span><span class="detail-value">${registration?.phone}</span></div>
            <div class="detail-row"><span class="detail-label">College</span><span class="detail-value">${registration?.college}</span></div>
          </div>
          <div class="events-list">
            <div style="color:#d4a837;font-weight:600;margin-bottom:8px;font-size:14px;">Registered Events</div>
            ${events.map((e) => `<div class="event-item">${e.name} — ${e.venue || ''}</div>`).join('')}
          </div>
          <div class="total">Total Paid: ${registration ? formatFee(registration.total_amount) : ''}</div>
          <div class="footer">
            <p>March 15-16, 2026 • College Campus</p>
            <p style="margin-top:4px;">This is your official entry pass. Please carry a printed or digital copy.</p>
          </div>
        </div>
      </body>
      </html>
    `);
        printWindow.document.close();
        printWindow.print();
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <main className="pt-24 pb-16 min-h-screen flex items-center justify-center">
                    <LoadingSpinner />
                </main>
            </>
        );
    }

    if (error || !registration) {
        return (
            <>
                <Navbar />
                <main className="pt-24 pb-16 min-h-screen flex items-center justify-center px-4">
                    <div className="glass-card p-12 text-center max-w-md">
                        <p className="text-manthan-crimson text-lg mb-4">{error || 'Registration not found'}</p>
                        <a href="/" className="text-manthan-gold hover:underline">Go to Home</a>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 px-4 min-h-screen">
                <div className="max-w-2xl mx-auto">
                    {/* Success Banner */}
                    <div className="text-center mb-8">
                        <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
                        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-gold-gradient mb-2">
                            Registration Confirmed!
                        </h1>
                        <p className="text-gray-400">
                            Your payment has been verified successfully.
                        </p>
                    </div>

                    {/* Entry Pass */}
                    <div ref={passRef} className="glass-card overflow-hidden border-manthan-gold/30">
                        {/* Pass Header */}
                        <div className="bg-gradient-to-r from-manthan-maroon/30 to-manthan-dark p-6 text-center border-b border-manthan-gold/20">
                            <h2 className="font-heading text-3xl font-bold text-gold-gradient tracking-widest">
                                MANTHAN
                            </h2>
                            <p className="text-manthan-crimson text-sm mt-1">2026 • College Tech Fest</p>
                            <div className="mt-4 flex items-center justify-center gap-2">
                                <Ticket size={18} className="text-manthan-gold" />
                                <span className="font-mono text-manthan-gold text-lg font-bold tracking-wider">
                                    {registration.ticket_id}
                                </span>
                            </div>
                            <span className="inline-block mt-2 px-4 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full">
                                ✓ PAID
                            </span>
                        </div>

                        {/* QR Code */}
                        {registration.qr_code && (
                            <div className="p-6 text-center border-b border-manthan-gold/10">
                                <img
                                    src={registration.qr_code}
                                    alt="Entry QR Code"
                                    className="mx-auto w-48 h-48 rounded-lg"
                                />
                                <p className="text-gray-500 text-xs mt-2">Scan for entry verification</p>
                            </div>
                        )}

                        {/* Details */}
                        <div className="p-6 space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <User size={16} className="text-manthan-gold/60" />
                                <span className="text-gray-500 w-20">Name</span>
                                <span className="text-gray-200">{registration.name}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Mail size={16} className="text-manthan-gold/60" />
                                <span className="text-gray-500 w-20">Email</span>
                                <span className="text-gray-200">{registration.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Phone size={16} className="text-manthan-gold/60" />
                                <span className="text-gray-500 w-20">Phone</span>
                                <span className="text-gray-200">{registration.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Building size={16} className="text-manthan-gold/60" />
                                <span className="text-gray-500 w-20">College</span>
                                <span className="text-gray-200">{registration.college}</span>
                            </div>
                        </div>

                        {/* Events */}
                        <div className="px-6 pb-6">
                            <h3 className="text-manthan-gold font-semibold mb-3 text-sm">Registered Events</h3>
                            <div className="space-y-2">
                                {events.map((event) => (
                                    <div
                                        key={event.id}
                                        className="flex items-center justify-between p-3 rounded-lg bg-manthan-black/50 border-l-2 border-manthan-gold/30"
                                    >
                                        <div>
                                            <p className="text-gray-200 text-sm font-medium">{event.name}</p>
                                            {event.id && teamRegistrationMap.get(event.id) && (
                                                <p className="text-gray-500 text-xs mt-1">
                                                    Team size: {teamRegistrationMap.get(event.id)?.team_size}
                                                    {teamRegistrationMap.get(event.id)?.team_name
                                                        ? ` · ${teamRegistrationMap.get(event.id)?.team_name}`
                                                        : ''}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-3 mt-1">
                                                {event.event_date && (
                                                    <span className="text-gray-500 text-xs flex items-center">
                                                        <Calendar size={10} className="mr-1" />
                                                        {formatDate(event.event_date)}
                                                    </span>
                                                )}
                                                {event.venue && (
                                                    <span className="text-gray-500 text-xs flex items-center">
                                                        <MapPin size={10} className="mr-1" />
                                                        {event.venue}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Total */}
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-manthan-gold/10">
                                <span className="text-gray-400 font-medium">Total Paid</span>
                                <span className="text-manthan-gold font-bold text-xl">
                                    {formatFee(registration.total_amount)}
                                </span>
                            </div>

                            {/* Payment ID */}
                            <div className="mt-3 text-xs text-gray-600">
                                Payment ID: {registration.razorpay_payment_id}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-manthan-dark/50 px-6 py-4 text-center border-t border-manthan-gold/10">
                            <p className="text-gray-500 text-xs">
                                March 15-16, 2026 • College Campus
                            </p>
                            <p className="text-gray-600 text-xs mt-1">
                                Please carry a printed or digital copy of this pass for entry.
                            </p>
                        </div>
                    </div>

                    {/* Download Button */}
                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={handleDownload}
                            className="px-8 py-3 bg-gradient-to-r from-manthan-maroon to-manthan-crimson text-white font-semibold rounded-lg hover:from-manthan-crimson hover:to-manthan-maroon transition-all shadow-lg flex items-center gap-2"
                        >
                            <Download size={18} />
                            Download Entry Pass
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
