'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const leftLinks = [
    { href: '/events', label: 'Events' },
    { href: '/sponsorship', label: 'Sponsorship' },
];

const rightLinks = [
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md transition-all duration-300 border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Desktop Navbar */}
                <div className="hidden md:flex items-center justify-between h-24">
                    {/* Left Links */}
                    <div className="flex-1 flex items-center justify-start space-x-8">
                        {leftLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm font-medium text-gray-300 hover:text-manthan-gold transition-all duration-300 uppercase tracking-widest"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Center Logo - College Logo */}
                    <div className="flex-shrink-0 flex items-center justify-center px-4">
                        <Link href="/" className="flex flex-col items-center">
                            <img
                                src="/bbbg-removebg-preview.png"
                                alt="College Logo"
                                className="h-16 w-auto object-contain hover:scale-105 transition-transform duration-300"
                            />
                        </Link>
                    </div>

                    {/* Right Links */}
                    <div className="flex-1 flex items-center justify-end space-x-8">
                        {rightLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm font-medium text-gray-300 hover:text-manthan-gold transition-all duration-300 uppercase tracking-widest"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href="/register"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-2 bg-gradient-to-r from-manthan-maroon to-manthan-crimson text-white text-xs font-bold rounded-full hover:shadow-[0_0_20px_rgba(220,20,60,0.4)] transition-all duration-500 uppercase tracking-widest border border-white/10"
                        >
                            Register
                        </Link>
                    </div>
                </div>

                <div className="md:hidden flex items-center justify-between h-20">
                    <Link href="/" className="flex items-center gap-3">
                        <img
                            src="/bbbg-removebg-preview.png"
                            alt="College Logo"
                            className="h-12 w-auto object-contain"
                        />
                        <div className="flex flex-col leading-none">
                            <span className="font-heading text-lg font-black text-gold-gradient tracking-tight">
                                MANTHAN
                            </span>
                            <span className="text-[8px] text-manthan-gold font-bold tracking-widest">
                                2026
                            </span>
                        </div>
                    </Link>

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 text-manthan-gold/80 hover:text-manthan-gold transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={`md:hidden absolute top-20 left-0 w-full bg-manthan-black/95 backdrop-blur-2xl border-b border-manthan-gold/20 transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="px-6 py-8 flex flex-col space-y-6 text-center">
                    {[...leftLinks, ...rightLinks].map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="text-lg font-medium text-gray-300 hover:text-manthan-gold transition-colors uppercase tracking-[0.2em]"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href="/register"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsOpen(false)}
                        className="py-4 bg-gradient-to-r from-manthan-maroon to-manthan-crimson text-white font-bold rounded-xl uppercase tracking-widest shadow-lg shadow-manthan-maroon/20"
                    >
                        Register Now
                    </Link>
                </div>
            </div>
        </nav>
    );
}
