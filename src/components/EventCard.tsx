'use client';

import Link from 'next/link';
import { Event } from '@/lib/types';
import { categoryColors, categoryIcons, formatFee, formatDate } from '@/lib/constants';
import { Calendar, MapPin, Users } from 'lucide-react';

interface EventCardProps {
    event: Event;
    selected?: boolean;
    onToggle?: (id: string) => void;
    selectable?: boolean;
}

export default function EventCard({ event, selected, onToggle, selectable }: EventCardProps) {
    const colors = categoryColors[event.category] || categoryColors.technical;

    const cardContent = (
        <div
            className={`glass-card p-6 transition-all duration-300 cursor-pointer group ${selected
                    ? 'border-manthan-gold ring-2 ring-manthan-gold/30'
                    : 'hover:border-manthan-gold/40'
                }`}
            onClick={() => selectable && onToggle?.(event.id)}
        >
            {/* Category Badge */}
            <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${colors.badge}`}>
                    {categoryIcons[event.category]} {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                </span>
                {selectable && (
                    <div
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${selected
                                ? 'bg-manthan-gold border-manthan-gold'
                                : 'border-gray-600 group-hover:border-manthan-gold/50'
                            }`}
                    >
                        {selected && (
                            <svg className="w-4 h-4 text-manthan-black" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        )}
                    </div>
                )}
            </div>

            {/* Title */}
            <h3 className="font-heading text-xl font-bold text-manthan-gold mb-2 group-hover:text-manthan-gold-light transition-colors">
                {event.name}
            </h3>

            {/* Description */}
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{event.description}</p>

            {/* Meta */}
            <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-500 text-xs">
                    <Calendar size={14} className="mr-2 text-manthan-gold/50" />
                    {formatDate(event.event_date)}
                </div>
                <div className="flex items-center text-gray-500 text-xs">
                    <MapPin size={14} className="mr-2 text-manthan-gold/50" />
                    {event.venue}
                </div>
                <div className="flex items-center text-gray-500 text-xs">
                    <Users size={14} className="mr-2 text-manthan-gold/50" />
                    {event.team_size === 1 ? 'Individual' : `Team of ${event.team_size}`}
                </div>
            </div>

            {/* Fee */}
            <div className="flex items-center justify-between pt-4 border-t border-manthan-gold/10">
                <span className="text-manthan-gold font-bold text-lg">{formatFee(event.fee)}</span>
                {!selectable && (
                    <span className="text-xs text-manthan-gold/60 group-hover:text-manthan-gold transition-colors">
                        View Details →
                    </span>
                )}
            </div>
        </div>
    );

    if (selectable) {
        return cardContent;
    }

    return <Link href={`/events/${event.slug}`}>{cardContent}</Link>;
}
