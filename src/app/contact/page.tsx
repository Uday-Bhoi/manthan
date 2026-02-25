'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In production, this would send to an API endpoint
        setSubmitted(true);
    };

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 px-4 min-h-screen">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-gold-gradient mb-4">
                            Contact Us
                        </h1>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Have questions about Manthan 2026? Reach out to us and we&apos;ll get back to you.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Contact Info */}
                        <div className="space-y-6">
                            <div className="glass-card p-8">
                                <h2 className="font-heading text-2xl font-bold text-manthan-gold mb-6">
                                    Get in Touch
                                </h2>
                                <div className="space-y-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-10 h-10 rounded-lg bg-manthan-maroon/20 flex items-center justify-center flex-shrink-0">
                                            <Mail size={20} className="text-manthan-gold" />
                                        </div>
                                        <div>
                                            <h3 className="text-manthan-gold font-medium">Email</h3>
                                            <p className="text-gray-400 text-sm">manthan@college.edu</p>
                                            <p className="text-gray-400 text-sm">support@manthan2026.in</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <div className="w-10 h-10 rounded-lg bg-manthan-maroon/20 flex items-center justify-center flex-shrink-0">
                                            <Phone size={20} className="text-manthan-gold" />
                                        </div>
                                        <div>
                                            <h3 className="text-manthan-gold font-medium">Phone</h3>
                                            <p className="text-gray-400 text-sm">+91 98765 43210 (General)</p>
                                            <p className="text-gray-400 text-sm">+91 98765 43211 (Technical)</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <div className="w-10 h-10 rounded-lg bg-manthan-maroon/20 flex items-center justify-center flex-shrink-0">
                                            <MapPin size={20} className="text-manthan-gold" />
                                        </div>
                                        <div>
                                            <h3 className="text-manthan-gold font-medium">Address</h3>
                                            <p className="text-gray-400 text-sm">
                                                College Campus,<br />
                                                City, State - 400001
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Coordinators */}
                            <div className="glass-card p-8">
                                <h2 className="font-heading text-xl font-bold text-manthan-gold mb-4">
                                    Event Coordinators
                                </h2>
                                <div className="space-y-3">
                                    {[
                                        { name: 'Rahul Sharma', role: 'General Secretary', phone: '+91 98765 43210' },
                                        { name: 'Priya Patel', role: 'Technical Head', phone: '+91 98765 43211' },
                                        { name: 'Amit Kumar', role: 'Cultural Head', phone: '+91 98765 43212' },
                                    ].map((coord) => (
                                        <div key={coord.name} className="flex items-center justify-between p-3 rounded-lg bg-manthan-black/50">
                                            <div>
                                                <p className="text-gray-200 text-sm font-medium">{coord.name}</p>
                                                <p className="text-gray-500 text-xs">{coord.role}</p>
                                            </div>
                                            <a href={`tel:${coord.phone}`} className="text-manthan-gold/60 hover:text-manthan-gold text-xs">
                                                {coord.phone}
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="glass-card p-8">
                            {submitted ? (
                                <div className="text-center py-12">
                                    <MessageSquare size={48} className="mx-auto text-manthan-gold mb-4" />
                                    <h3 className="font-heading text-2xl font-bold text-manthan-gold mb-2">
                                        Message Sent!
                                    </h3>
                                    <p className="text-gray-400">
                                        We&apos;ll get back to you as soon as possible.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <h2 className="font-heading text-2xl font-bold text-manthan-gold mb-6">
                                        Send a Message
                                    </h2>
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1.5">Your Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={form.name}
                                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                className="w-full px-4 py-3 rounded-lg bg-manthan-black/50 border border-manthan-gold/20 text-gray-200 text-sm focus:border-manthan-gold/50 focus:outline-none focus:ring-1 focus:ring-manthan-gold/30 transition-colors"
                                                placeholder="Enter your name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1.5">Email</label>
                                            <input
                                                type="email"
                                                required
                                                value={form.email}
                                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                className="w-full px-4 py-3 rounded-lg bg-manthan-black/50 border border-manthan-gold/20 text-gray-200 text-sm focus:border-manthan-gold/50 focus:outline-none focus:ring-1 focus:ring-manthan-gold/30 transition-colors"
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1.5">Subject</label>
                                            <input
                                                type="text"
                                                required
                                                value={form.subject}
                                                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                                className="w-full px-4 py-3 rounded-lg bg-manthan-black/50 border border-manthan-gold/20 text-gray-200 text-sm focus:border-manthan-gold/50 focus:outline-none focus:ring-1 focus:ring-manthan-gold/30 transition-colors"
                                                placeholder="Subject"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1.5">Message</label>
                                            <textarea
                                                required
                                                rows={5}
                                                value={form.message}
                                                onChange={(e) => setForm({ ...form, message: e.target.value })}
                                                className="w-full px-4 py-3 rounded-lg bg-manthan-black/50 border border-manthan-gold/20 text-gray-200 text-sm focus:border-manthan-gold/50 focus:outline-none focus:ring-1 focus:ring-manthan-gold/30 transition-colors resize-none"
                                                placeholder="Your message..."
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full py-3.5 bg-gradient-to-r from-manthan-maroon to-manthan-crimson text-white font-semibold rounded-lg hover:from-manthan-crimson hover:to-manthan-maroon transition-all duration-300 flex items-center justify-center gap-2"
                                        >
                                            <Send size={18} />
                                            Send Message
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
