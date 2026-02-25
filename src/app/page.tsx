import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, Users, Trophy, ArrowRight, Zap, Music, Dumbbell } from 'lucide-react';

export default function HomePage() {
    return (
        <>
            <Navbar />
            <main>
                {/* Hero Section */}
                <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                    {/* Radial glow */}
                    <div className="absolute inset-0 bg-gradient-radial from-manthan-maroon/20 via-transparent to-transparent" />

                    <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                        {/* Decorative line */}
                        <div className="flex items-center justify-center mb-6">
                            <div className="h-px w-16 bg-gradient-to-r from-transparent to-manthan-gold/50" />
                            <span className="px-4 text-manthan-gold/80 text-sm tracking-[0.3em] uppercase font-body">
                                Presents
                            </span>
                            <div className="h-px w-16 bg-gradient-to-l from-transparent to-manthan-gold/50" />
                        </div>

                        {/* Title */}
                        <h1 className="font-heading text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-gold-gradient mb-4 tracking-wider">
                            MANTHAN
                        </h1>
                        <p className="font-heading text-xl sm:text-2xl text-manthan-crimson font-semibold mb-2 red-glow tracking-widest">
                            2026
                        </p>
                        <p className="text-gray-400 text-lg sm:text-xl mb-4 font-light">
                            The Ultimate College Tech Fest
                        </p>

                        {/* Date */}
                        <div className="inline-flex items-center space-x-2 px-6 py-2 rounded-full border border-manthan-gold/20 bg-manthan-gold/5 mb-8">
                            <Calendar size={18} className="text-manthan-gold" />
                            <span className="text-manthan-gold font-medium">March 15 - 16, 2026</span>
                        </div>

                        {/* CTA */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/register"
                                className="px-8 py-4 bg-gradient-to-r from-manthan-maroon to-manthan-crimson text-white font-bold rounded-lg text-lg hover:from-manthan-crimson hover:to-manthan-maroon transition-all duration-300 shadow-xl shadow-manthan-maroon/30 flex items-center gap-2 group"
                            >
                                Register Now
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/events"
                                className="px-8 py-4 border border-manthan-gold/30 text-manthan-gold font-semibold rounded-lg text-lg hover:bg-manthan-gold/10 transition-all duration-300"
                            >
                                Explore Events
                            </Link>
                        </div>
                    </div>

                    {/* Scroll indicator */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                        <div className="w-6 h-10 rounded-full border-2 border-manthan-gold/30 flex items-start justify-center p-1">
                            <div className="w-1.5 h-3 bg-manthan-gold/50 rounded-full animate-pulse" />
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-16 px-4">
                    <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { value: '12+', label: 'Events', icon: Trophy },
                            { value: '200+', label: 'Participants', icon: Users },
                            { value: '2', label: 'Days', icon: Calendar },
                            { value: '₹50K+', label: 'Prize Pool', icon: Zap },
                        ].map((stat) => (
                            <div key={stat.label} className="glass-card p-6 text-center">
                                <stat.icon size={28} className="mx-auto mb-3 text-manthan-gold" />
                                <div className="text-3xl font-bold text-gold-gradient font-heading">{stat.value}</div>
                                <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Event Categories Section */}
                <section className="py-16 px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-center text-gold-gradient mb-4">
                            Event Categories
                        </h2>
                        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
                            Choose from our diverse range of events across technical, cultural, and sports categories.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: 'Technical',
                                    icon: Zap,
                                    description: 'Coding contests, hackathons, robo wars, and more. Test your technical prowess.',
                                    events: ['CodeStorm', 'HackNova', 'RoboWars', 'WebCraft', 'DebugDash'],
                                    gradient: 'from-blue-600/20 to-manthan-maroon/20',
                                    borderColor: 'border-blue-500/20 hover:border-blue-400/40',
                                },
                                {
                                    title: 'Cultural',
                                    icon: Music,
                                    description: 'Dance, music, drama, and photography. Express your creative side.',
                                    events: ['Rhythmix', 'Sargam', 'Natya', 'Lens & Frame'],
                                    gradient: 'from-purple-600/20 to-manthan-maroon/20',
                                    borderColor: 'border-purple-500/20 hover:border-purple-400/40',
                                },
                                {
                                    title: 'Sports',
                                    icon: Dumbbell,
                                    description: 'Cricket, futsal, badminton. Compete in exciting sports tournaments.',
                                    events: ['Cricket Blitz', 'Futsal Fury', 'Badminton Bash'],
                                    gradient: 'from-green-600/20 to-manthan-maroon/20',
                                    borderColor: 'border-green-500/20 hover:border-green-400/40',
                                },
                            ].map((cat) => (
                                <div
                                    key={cat.title}
                                    className={`glass-card p-8 bg-gradient-to-br ${cat.gradient} ${cat.borderColor} transition-all duration-300`}
                                >
                                    <cat.icon size={36} className="text-manthan-gold mb-4" />
                                    <h3 className="font-heading text-2xl font-bold text-manthan-gold mb-3">{cat.title}</h3>
                                    <p className="text-gray-400 text-sm mb-4">{cat.description}</p>
                                    <ul className="space-y-1.5">
                                        {cat.events.map((evt) => (
                                            <li key={evt} className="text-gray-300 text-sm flex items-center">
                                                <span className="w-1.5 h-1.5 rounded-full bg-manthan-gold/50 mr-2" />
                                                {evt}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-4">
                    <div className="max-w-4xl mx-auto text-center glass-card p-12 bg-gradient-to-br from-manthan-maroon/20 to-manthan-dark">
                        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gold-gradient mb-4">
                            Ready to Compete?
                        </h2>
                        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                            Register now and secure your spot in Manthan 2026. Limited seats available!
                        </p>
                        <Link
                            href="/register"
                            className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-manthan-maroon to-manthan-crimson text-white font-bold rounded-lg text-lg hover:from-manthan-crimson hover:to-manthan-maroon transition-all duration-300 shadow-xl shadow-manthan-maroon/30 group"
                        >
                            Register Now
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
