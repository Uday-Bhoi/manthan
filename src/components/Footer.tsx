import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-manthan-black border-t border-manthan-gold/10 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <h3 className="font-heading text-2xl font-bold text-gold-gradient mb-4">
                            MANTHAN 2026
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            The ultimate college tech fest featuring technical, cultural, and
                            sports events. Join us for two days of innovation, creativity, and
                            competition.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-heading text-lg text-manthan-gold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            {[
                                { href: '/events', label: 'Events' },
                                { href: '/schedule', label: 'Schedule' },
                                { href: '/register', label: 'Register' },
                                { href: '/contact', label: 'Contact' },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-manthan-gold text-sm transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-heading text-lg text-manthan-gold mb-4">Contact Us</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center space-x-3 text-gray-400 text-sm">
                                <Mail size={16} className="text-manthan-gold/60" />
                                <span>manthan@college.edu</span>
                            </li>
                            <li className="flex items-center space-x-3 text-gray-400 text-sm">
                                <Phone size={16} className="text-manthan-gold/60" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center space-x-3 text-gray-400 text-sm">
                                <MapPin size={16} className="text-manthan-gold/60" />
                                <span>College Campus, City</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-manthan-gold/10 text-center">
                    <p className="text-gray-500 text-sm">
                        © 2026 Manthan Tech Fest. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
