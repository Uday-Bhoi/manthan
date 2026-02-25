'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/events', label: 'Events' },
    { href: '/schedule', label: 'Schedule' },
    { href: '/register', label: 'Register' },
    { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-manthan-black/90 backdrop-blur-md border-b border-manthan-gold/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="font-heading text-2xl font-bold text-gold-gradient">
                            MANTHAN
                        </span>
                        <span className="text-xs text-manthan-gold/60 font-body">2026</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-manthan-gold transition-colors duration-200 rounded-lg hover:bg-manthan-gold/5"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href="/register"
                            className="ml-4 px-6 py-2 bg-gradient-to-r from-manthan-maroon to-manthan-crimson text-white text-sm font-semibold rounded-lg hover:from-manthan-crimson hover:to-manthan-maroon transition-all duration-300 shadow-lg shadow-manthan-maroon/20"
                        >
                            Register Now
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 text-gray-300 hover:text-manthan-gold"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="md:hidden bg-manthan-black/95 border-b border-manthan-gold/20">
                    <div className="px-4 py-3 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-3 text-gray-300 hover:text-manthan-gold hover:bg-manthan-gold/5 rounded-lg transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href="/register"
                            onClick={() => setIsOpen(false)}
                            className="block mt-2 px-4 py-3 bg-gradient-to-r from-manthan-maroon to-manthan-crimson text-white text-center font-semibold rounded-lg"
                        >
                            Register Now
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
