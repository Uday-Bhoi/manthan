'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { History, Target, Users, Sparkles, Trophy, Rocket } from 'lucide-react';

export default function AboutPage() {
    return (
        <>
            <Navbar />

            <main className="pt-24 pb-20 px-4 md:pt-32 relative min-h-screen">
                {/* Background Glows */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-manthan-maroon/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-manthan-gold/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-5xl mx-auto relative z-10">
                    {/* Hero Section */}
                    <div className="text-center mb-20">
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-manthan-gold text-xs font-bold uppercase tracking-[0.4em] mb-4 block"
                        >
                            Roots to Realms
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="font-heading text-4xl md:text-6xl font-bold text-gold-gradient mb-6"
                        >
                            The Story of Manthan
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed"
                        >
                            Beyond just a festival, Manthan is a journey of introspection and excellence.
                            It is where ancient wisdom meets futuristic innovation.
                        </motion.p>
                    </div>

                    {/* Content Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="glass-card p-8 bg-gradient-to-br from-manthan-maroon/10 to-transparent border-manthan-gold/10"
                        >
                            <div className="w-12 h-12 rounded-xl bg-manthan-gold/10 flex items-center justify-center mb-6">
                                <History className="text-manthan-gold" size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-manthan-gold mb-4">Our Legacy</h2>
                            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                Established in 2023, Manthan was born out of a desire to create a multidisciplinary platform
                                that celebrates both technical prowess and cultural richness. What started as a local college
                                event has rapidly evolved into a regional phenomenon.
                            </p>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Over the years, we have seen exponential growth in participation, complexity of events,
                                and the impact we leave on our students and the community.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="glass-card p-8 bg-gradient-to-br from-manthan-crimson/10 to-transparent border-manthan-gold/10"
                        >
                            <div className="w-12 h-12 rounded-xl bg-manthan-gold/10 flex items-center justify-center mb-6">
                                <Target className="text-manthan-gold" size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-manthan-gold mb-4">The Vision</h2>
                            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                Our theme "Roots to Realms" encapsulates our philosophy: staying grounded in our fundamental
                                knowledge while reaching for the infinite realms of future technology and art.
                            </p>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                We aim to foster an environment of healthy competition, collaborative learning, and
                                creative expression that empowers the leaders of tomorrow.
                            </p>
                        </motion.div>
                    </div>

                    {/* Timeline / Highlights */}
                    <div className="mb-24">
                        <h2 className="font-heading text-3xl font-bold text-center text-gold-gradient mb-12">Journey Through Time</h2>
                        <div className="space-y-8">
                            {[
                                {
                                    year: '2023',
                                    title: 'The Inception',
                                    desc: 'Manthan was launched as a humble initiative by BVIMIT to bridge the gap between classroom learning and practical application.',
                                    icon: Rocket
                                },
                                {
                                    year: '2024',
                                    title: 'Expanding Horizons',
                                    desc: 'Introduced regional level competitions and established the three pillars: Technical, Cultural, and Sports.',
                                    icon: Sparkles
                                },
                                {
                                    year: '2025',
                                    title: 'A New Standard',
                                    desc: 'Reached record-breaking engagement with over 20+ events and the first-ever e-sports arena integration.',
                                    icon: Trophy
                                }
                            ].map((item, idx) => (
                                <motion.div
                                    key={item.year}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="relative pl-12 md:pl-0"
                                >
                                    <div className="md:grid md:grid-cols-12 md:gap-8 items-center">
                                        <div className="hidden md:block md:col-span-2 text-right">
                                            <span className="text-3xl font-bold text-manthan-gold/40">{item.year}</span>
                                        </div>
                                        <div className="hidden md:flex md:col-span-1 justify-center relative">
                                            <div className="w-px h-full bg-manthan-gold/20 absolute top-0 bottom-0" />
                                            <div className="w-4 h-4 rounded-full bg-manthan-gold relative z-10 my-auto" />
                                        </div>
                                        <div className="md:col-span-9 bg-white/[0.02] border border-white/5 p-6 rounded-2xl group hover:border-manthan-gold/30 transition-all">
                                            <div className="flex items-center gap-4 mb-2">
                                                <item.icon size={20} className="text-manthan-gold" />
                                                <h3 className="text-xl font-bold text-gray-200">{item.title}</h3>
                                                <span className="md:hidden text-manthan-gold/40 font-bold ml-auto">{item.year}</span>
                                            </div>
                                            <p className="text-gray-400 text-sm">{item.desc}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { label: 'Total Events', val: '25+', icon: Trophy },
                            { label: 'Participants', val: '2000+', icon: Users },
                            { label: 'Years of Excellence', val: '3+', icon: History },
                            { label: 'Innovation Prize', val: '₹1L+', icon: Sparkles },
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="text-center p-6 bg-manthan-gold/5 rounded-2xl border border-manthan-gold/10"
                            >
                                <stat.icon className="text-manthan-gold mx-auto mb-3 opacity-60" size={20} />
                                <div className="text-2xl font-bold text-manthan-gold mb-1">{stat.val}</div>
                                <div className="text-[10px] uppercase tracking-wider text-gray-500">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}
