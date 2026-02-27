'use client';

import { useState } from 'react';
import { Event } from '@/lib/types';
import EventCard from '@/components/EventCard';
import { getSportsTrackByName } from '@/lib/constants';

const categories = ['all', 'technical', 'cultural', 'sports'];

export default function EventsFilter({ events }: { events: Event[] }) {
    const [activeCategory, setActiveCategory] = useState('all');

    const filtered =
        activeCategory === 'all'
            ? events
            : events.filter((e) => e.category === activeCategory);

    const sportsEvents = filtered.filter((e) => e.category === 'sports');
    const outdoorSports = sportsEvents.filter((event) => getSportsTrackByName(event.name) === 'outdoor');
    const indoorSports = sportsEvents.filter((event) => getSportsTrackByName(event.name) === 'indoor');
    const otherSports = sportsEvents.filter((event) => !getSportsTrackByName(event.name));

    return (
        <>
            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${activeCategory === cat
                            ? 'bg-manthan-gold text-manthan-black shadow-lg shadow-manthan-gold/20'
                            : 'bg-manthan-dark border border-manthan-gold/20 text-gray-400 hover:text-manthan-gold hover:border-manthan-gold/40'
                            }`}
                    >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                ))}
            </div>

            {/* Events Grid */}
            {activeCategory === 'sports' ? (
                <div className="space-y-10">
                    {outdoorSports.length > 0 && (
                        <section>
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
                                Outdoor Sports
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {outdoorSports.map((event) => (
                                    <EventCard key={event.id} event={event} />
                                ))}
                            </div>
                        </section>
                    )}

                    {indoorSports.length > 0 && (
                        <section>
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
                                Indoor Sports
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {indoorSports.map((event) => (
                                    <EventCard key={event.id} event={event} />
                                ))}
                            </div>
                        </section>
                    )}

                    {otherSports.length > 0 && (
                        <section>
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
                                More Sports Events
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {otherSports.map((event) => (
                                    <EventCard key={event.id} event={event} />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            )}

            {filtered.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-gray-500 text-lg">No events found in this category.</p>
                </div>
            )}
        </>
    );
}
