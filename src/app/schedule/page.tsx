import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { scheduleData, categoryColors } from '@/lib/constants';
import { Clock, MapPin } from 'lucide-react';

export const metadata = {
    title: 'Schedule | Manthan 2026',
    description: 'Complete schedule for Manthan 2026 tech fest',
};

export default function SchedulePage() {
    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 px-4 min-h-screen">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-gold-gradient mb-4">
                            Schedule
                        </h1>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Plan your two days at Manthan 2026. Here&apos;s the complete event timeline.
                        </p>
                    </div>

                    {/* Schedule Days */}
                    <div className="space-y-12">
                        {scheduleData.map((day) => (
                            <div key={day.date}>
                                <h2 className="font-heading text-2xl font-bold text-manthan-gold mb-6 flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-manthan-crimson mr-3 animate-pulse" />
                                    {day.date}
                                </h2>

                                <div className="relative">
                                    {/* Timeline line */}
                                    <div className="absolute left-[18px] top-0 bottom-0 w-px bg-manthan-gold/20" />

                                    <div className="space-y-4">
                                        {day.slots.map((slot, index) => {
                                            const colors = categoryColors[slot.category] || categoryColors.technical;
                                            return (
                                                <div key={index} className="relative flex items-start gap-4 pl-12">
                                                    {/* Timeline dot */}
                                                    <div className="absolute left-[12px] top-4 w-[13px] h-[13px] rounded-full border-2 border-manthan-gold bg-manthan-black" />

                                                    <div className={`flex-1 glass-card p-5 ${colors.border} border transition-all duration-200 hover:border-manthan-gold/40`}>
                                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                            <div>
                                                                <h3 className="font-heading text-lg font-bold text-manthan-gold">
                                                                    {slot.event}
                                                                </h3>
                                                                <div className="flex items-center gap-4 mt-1">
                                                                    <span className="flex items-center text-gray-400 text-xs">
                                                                        <Clock size={12} className="mr-1" />
                                                                        {slot.time}
                                                                    </span>
                                                                    <span className="flex items-center text-gray-400 text-xs">
                                                                        <MapPin size={12} className="mr-1" />
                                                                        {slot.venue}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <span className={`px-3 py-1 text-xs font-medium rounded-full self-start ${colors.badge}`}>
                                                                {slot.category.charAt(0).toUpperCase() + slot.category.slice(1)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
