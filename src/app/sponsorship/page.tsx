'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Trophy, Star, ShieldCheck, Zap, Heart } from 'lucide-react';

const sponsors = [
    {
        tier: 'Title Sponsor',
        icon: Trophy,
        items: [
            { id: 1, name: 'Google Cloud', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg' }
        ]
    },
    {
        tier: 'Co-Sponsors',
        icon: Star,
        items: [
            { id: 1, name: 'Razorpay', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg' },
            { id: 2, name: 'AWS', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg' }
        ]
    },
    {
        tier: 'Technology Partners',
        icon: Zap,
        items: [
            { id: 1, name: 'MongoDB', logo: 'https://upload.wikimedia.org/wikipedia/en/4/45/MongoDB-Logo.svg' },
            { id: 2, name: 'Vercel', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Vercel_logo_black.svg' },
            { id: 3, name: 'Postman', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Postman_%28software%29.png' }
        ]
    },
    {
        tier: 'Associate Partners',
        icon: ShieldCheck,
        items: [
            { id: 1, name: 'Red Bull', logo: 'https://upload.wikimedia.org/wikipedia/en/f/f5/Red_Bull_Logo.svg' },
            { id: 2, name: 'Starbucks', logo: 'https://upload.wikimedia.org/wikipedia/en/d/d3/Starbucks_Corporation_Logo_2011.svg' },
            { id: 3, name: 'Intel', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Intel_logo_%282006-2020%29.svg' }
        ]
    }
];

export default function SponsorshipPage() {
    return (
        <>
            <Navbar />

            <main className="pt-24 pb-20 px-4 md:pt-32 relative min-h-screen overflow-hidden">
                {/* Background Glows */}
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-manthan-maroon/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-manthan-gold/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-6xl mx-auto relative z-10">
                    {/* Hero Section */}
                    <div className="text-center mb-20">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="font-heading text-4xl md:text-6xl font-bold text-gold-gradient mb-6"
                        >
                            Our Proud Sponsors
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-gray-400 text-lg max-w-2xl mx-auto mb-10"
                        >
                            The backbone of Manthan 2026. We are honored to partner with global leaders
                            who share our passion for technology and students' success.
                        </motion.p>
                    </div>

                    {/* Sponsorship Tiers */}
                    <div className="space-y-24">
                        {sponsors.map((tier, idx) => (
                            <motion.section
                                key={tier.tier}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="flex items-center gap-4 mb-10 pb-4 border-b border-manthan-gold/10">
                                    <div className="w-12 h-12 rounded-full bg-manthan-gold/10 flex items-center justify-center text-manthan-gold">
                                        <tier.icon size={24} />
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-200 tracking-tight uppercase">
                                        {tier.tier}
                                    </h2>
                                </div>

                                <div className={`grid gap-6 ${tier.tier === 'Title Sponsor' ? 'grid-cols-1 max-w-md mx-auto' :
                                        tier.tier === 'Co-Sponsors' ? 'grid-cols-1 md:grid-cols-2' :
                                            'grid-cols-2 md:grid-cols-3'
                                    }`}>
                                    {tier.items.map((sponsor) => (
                                        <div
                                            key={sponsor.id}
                                            className="group relative h-40 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-center p-8 hover:border-manthan-gold/30 hover:bg-manthan-gold/[0.03] transition-all duration-500 overflow-hidden"
                                        >
                                            {/* Glow Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-manthan-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                            <img
                                                src={sponsor.logo}
                                                alt={sponsor.name}
                                                className="max-h-16 w-auto object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 scale-100 group-hover:scale-110"
                                            />

                                            <div className="absolute bottom-4 left-0 right-0 text-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                                <span className="text-[10px] font-bold text-manthan-gold uppercase tracking-[0.2em]">
                                                    {sponsor.name}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        ))}
                    </div>

                    {/* CTA Section */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="mt-32 p-12 glass-card text-center bg-gradient-to-r from-manthan-maroon/20 to-manthan-dark border-manthan-gold/20"
                    >
                        <Heart className="text-manthan-crimson mx-auto mb-6" size={48} />
                        <h2 className="text-3xl font-bold text-gold-gradient mb-4">Want to partner with us?</h2>
                        <p className="text-gray-400 max-w-xl mx-auto mb-8">
                            Join us in making Manthan 2026 the biggest celebration of talent.
                            Partner with us and gain visibility among thousands of enthusiastic students.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="mailto:manthan@bvimit.co.in"
                                className="px-8 py-4 bg-manthan-gold text-black font-bold rounded-lg hover:bg-manthan-gold-light transition-all shadow-lg"
                            >
                                Contact for Sponsorship
                            </a>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </>
    );
}
