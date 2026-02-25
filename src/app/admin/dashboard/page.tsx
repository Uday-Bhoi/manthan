'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Registration, Event } from '@/lib/types';
import { formatFee } from '@/lib/constants';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
    LogOut, Search, Filter, Users, IndianRupee, CheckCircle,
    Clock, RefreshCw, UserCheck, AlertCircle, ChevronDown,
    Ticket as TicketIcon, Eye
} from 'lucide-react';

interface Stats {
    totalRegistrations: number;
    totalRevenue: number;
    checkedIn: number;
    pendingPayments: number;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<Stats | null>(null);
    const [events, setEvents] = useState<Partial<Event>[]>([]);
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [total, setTotal] = useState(0);

    // Filters
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [eventFilter, setEventFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('');
    const [page, setPage] = useState(1);

    // Check-in state
    const [checkingIn, setCheckingIn] = useState<string | null>(null);
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    const getToken = () => localStorage.getItem('admin_token');

    const fetchStats = useCallback(async () => {
        const token = getToken();
        if (!token) { router.push('/admin'); return; }

        try {
            const res = await fetch('/api/admin/stats', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.status === 401) { router.push('/admin'); return; }
            const data = await res.json();
            setStats(data.stats);
            setEvents(data.events);
        } catch {
            console.error('Failed to fetch stats');
        }
    }, [router]);

    const fetchRegistrations = useCallback(async () => {
        const token = getToken();
        if (!token) return;

        try {
            const params = new URLSearchParams({ page: page.toString(), limit: '50' });
            if (statusFilter !== 'all') params.set('status', statusFilter);
            if (eventFilter !== 'all') params.set('event_id', eventFilter);
            if (search) params.set('search', search);
            if (dateFilter) params.set('date', dateFilter);

            const res = await fetch(`/api/admin/registrations?${params}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.status === 401) { router.push('/admin'); return; }
            const data = await res.json();
            setRegistrations(data.registrations || []);
            setTotal(data.total || 0);
        } catch {
            console.error('Failed to fetch registrations');
        }
    }, [search, statusFilter, eventFilter, dateFilter, page, router]);

    useEffect(() => {
        const token = getToken();
        if (!token) { router.push('/admin'); return; }

        Promise.all([fetchStats(), fetchRegistrations()]).finally(() => setLoading(false));
    }, [fetchStats, fetchRegistrations, router]);

    useEffect(() => {
        fetchRegistrations();
    }, [fetchRegistrations]);

    // Auto-refresh every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetchStats();
            fetchRegistrations();
        }, 30000);
        return () => clearInterval(interval);
    }, [fetchStats, fetchRegistrations]);

    const handleCheckIn = async (regId: string) => {
        const token = getToken();
        if (!token) return;

        setCheckingIn(regId);
        try {
            const res = await fetch(`/api/admin/check-in/${regId}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (!res.ok) {
                alert(data.error || 'Check-in failed');
                return;
            }

            // Update local state
            setRegistrations((prev) =>
                prev.map((r) =>
                    r.id === regId
                        ? { ...r, checked_in: true, checked_in_at: new Date().toISOString() }
                        : r
                )
            );
            fetchStats();
        } catch {
            alert('Check-in failed. Please try again.');
        } finally {
            setCheckingIn(null);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        router.push('/admin');
    };

    const handleRefresh = () => {
        fetchStats();
        fetchRegistrations();
    };

    const getEventName = (eventId: string) => {
        return events.find((e) => e.id === eventId)?.name || eventId;
    };

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-manthan-black">
                <LoadingSpinner size="lg" />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-manthan-black">
            {/* Top Bar */}
            <header className="sticky top-0 z-50 bg-manthan-black/90 backdrop-blur-md border-b border-manthan-gold/20 px-4 py-3">
                <div className="max-w-[1600px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="font-heading text-xl font-bold text-gold-gradient">MANTHAN</h1>
                        <span className="text-xs text-manthan-gold/50 border border-manthan-gold/20 px-2 py-0.5 rounded">
                            Admin Dashboard
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleRefresh}
                            className="p-2 text-gray-400 hover:text-manthan-gold transition-colors"
                            title="Refresh"
                        >
                            <RefreshCw size={18} />
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-manthan-crimson transition-colors"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-[1600px] mx-auto px-4 py-6">
                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="glass-card p-5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <Users size={20} className="text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-100">{stats.totalRegistrations}</p>
                                    <p className="text-xs text-gray-500">Total Registrations</p>
                                </div>
                            </div>
                        </div>
                        <div className="glass-card p-5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                                    <IndianRupee size={20} className="text-green-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-100">{formatFee(stats.totalRevenue)}</p>
                                    <p className="text-xs text-gray-500">Total Revenue</p>
                                </div>
                            </div>
                        </div>
                        <div className="glass-card p-5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-manthan-gold/10 flex items-center justify-center">
                                    <CheckCircle size={20} className="text-manthan-gold" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-100">{stats.checkedIn}</p>
                                    <p className="text-xs text-gray-500">Checked In</p>
                                </div>
                            </div>
                        </div>
                        <div className="glass-card p-5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                                    <Clock size={20} className="text-yellow-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-100">{stats.pendingPayments}</p>
                                    <p className="text-xs text-gray-500">Pending Payments</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="glass-card p-4 mb-6">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex-1 min-w-[200px] relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                placeholder="Search by ticket ID, name, email, phone..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-manthan-black/50 border border-manthan-gold/20 text-gray-200 text-sm focus:border-manthan-gold/50 focus:outline-none transition-colors"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                            className="px-4 py-2.5 rounded-lg bg-manthan-black/50 border border-manthan-gold/20 text-gray-200 text-sm focus:outline-none"
                        >
                            <option value="all">All Status</option>
                            <option value="PAID">Paid</option>
                            <option value="PENDING">Pending</option>
                            <option value="FAILED">Failed</option>
                        </select>
                        <select
                            value={eventFilter}
                            onChange={(e) => { setEventFilter(e.target.value); setPage(1); }}
                            className="px-4 py-2.5 rounded-lg bg-manthan-black/50 border border-manthan-gold/20 text-gray-200 text-sm focus:outline-none"
                        >
                            <option value="all">All Events</option>
                            {events.map((e) => (
                                <option key={e.id} value={e.id}>{e.name}</option>
                            ))}
                        </select>
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => { setDateFilter(e.target.value); setPage(1); }}
                            className="px-4 py-2.5 rounded-lg bg-manthan-black/50 border border-manthan-gold/20 text-gray-200 text-sm focus:outline-none"
                        />
                        {(search || statusFilter !== 'all' || eventFilter !== 'all' || dateFilter) && (
                            <button
                                onClick={() => { setSearch(''); setStatusFilter('all'); setEventFilter('all'); setDateFilter(''); setPage(1); }}
                                className="px-4 py-2.5 text-sm text-manthan-crimson hover:underline"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>

                {/* Results count */}
                <div className="flex items-center justify-between mb-4">
                    <p className="text-gray-500 text-sm">
                        Showing {registrations.length} of {total} registrations
                    </p>
                </div>

                {/* Registrations Table */}
                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-manthan-gold/10 text-left">
                                    <th className="px-4 py-3 text-manthan-gold/70 font-medium text-xs">Ticket ID</th>
                                    <th className="px-4 py-3 text-manthan-gold/70 font-medium text-xs">Name</th>
                                    <th className="px-4 py-3 text-manthan-gold/70 font-medium text-xs hidden md:table-cell">Email</th>
                                    <th className="px-4 py-3 text-manthan-gold/70 font-medium text-xs hidden lg:table-cell">Phone</th>
                                    <th className="px-4 py-3 text-manthan-gold/70 font-medium text-xs">Amount</th>
                                    <th className="px-4 py-3 text-manthan-gold/70 font-medium text-xs">Status</th>
                                    <th className="px-4 py-3 text-manthan-gold/70 font-medium text-xs">Check-in</th>
                                    <th className="px-4 py-3 text-manthan-gold/70 font-medium text-xs">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registrations.map((reg) => (
                                    <>
                                        <tr
                                            key={reg.id}
                                            className="border-b border-manthan-gold/5 hover:bg-manthan-gold/5 transition-colors"
                                        >
                                            <td className="px-4 py-3">
                                                <span className="font-mono text-manthan-gold text-xs">{reg.ticket_id}</span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-200">{reg.name}</td>
                                            <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{reg.email}</td>
                                            <td className="px-4 py-3 text-gray-400 hidden lg:table-cell">{reg.phone}</td>
                                            <td className="px-4 py-3 text-gray-200 font-medium">{formatFee(reg.total_amount)}</td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${reg.payment_status === 'PAID'
                                                        ? 'bg-green-500/20 text-green-400'
                                                        : reg.payment_status === 'PENDING'
                                                            ? 'bg-yellow-500/20 text-yellow-400'
                                                            : 'bg-red-500/20 text-red-400'
                                                        }`}
                                                >
                                                    {reg.payment_status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                {reg.payment_status === 'PAID' ? (
                                                    reg.checked_in ? (
                                                        <span className="flex items-center gap-1 text-green-400 text-xs">
                                                            <UserCheck size={14} />
                                                            Done
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleCheckIn(reg.id)}
                                                            disabled={checkingIn === reg.id}
                                                            className="px-3 py-1.5 bg-manthan-gold/10 text-manthan-gold text-xs rounded-lg hover:bg-manthan-gold/20 transition-colors disabled:opacity-50 flex items-center gap-1"
                                                        >
                                                            {checkingIn === reg.id ? (
                                                                <LoadingSpinner size="sm" />
                                                            ) : (
                                                                <>
                                                                    <UserCheck size={12} />
                                                                    Check In
                                                                </>
                                                            )}
                                                        </button>
                                                    )
                                                ) : (
                                                    <span className="text-gray-600 text-xs">—</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => setExpandedRow(expandedRow === reg.id ? null : reg.id)}
                                                    className="p-1.5 text-gray-500 hover:text-manthan-gold transition-colors"
                                                >
                                                    <ChevronDown
                                                        size={16}
                                                        className={`transition-transform ${expandedRow === reg.id ? 'rotate-180' : ''}`}
                                                    />
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedRow === reg.id && (
                                            <tr key={`${reg.id}-details`} className="bg-manthan-dark/30">
                                                <td colSpan={8} className="px-4 py-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                                                        <div>
                                                            <p className="text-gray-500 mb-1">College</p>
                                                            <p className="text-gray-300">{reg.college}</p>
                                                            <p className="text-gray-500 mt-2 mb-1">Year / Dept</p>
                                                            <p className="text-gray-300">{reg.year} - {reg.department}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-500 mb-1">Events</p>
                                                            <div className="space-y-1">
                                                                {reg.event_ids.map((eid) => (
                                                                    <span
                                                                        key={eid}
                                                                        className="inline-block px-2 py-0.5 bg-manthan-gold/10 text-manthan-gold rounded mr-1 mb-1"
                                                                    >
                                                                        {getEventName(eid)}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-500 mb-1">Payment Details</p>
                                                            <p className="text-gray-300">Order: {reg.razorpay_order_id || '—'}</p>
                                                            <p className="text-gray-300">Payment: {reg.razorpay_payment_id || '—'}</p>
                                                            <p className="text-gray-500 mt-2 mb-1">Registered At</p>
                                                            <p className="text-gray-300">{new Date(reg.created_at).toLocaleString('en-IN')}</p>
                                                            {reg.checked_in_at && (
                                                                <>
                                                                    <p className="text-gray-500 mt-2 mb-1">Checked In At</p>
                                                                    <p className="text-green-400">{new Date(reg.checked_in_at).toLocaleString('en-IN')}</p>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {registrations.length === 0 && (
                        <div className="py-16 text-center">
                            <AlertCircle size={32} className="mx-auto text-gray-600 mb-3" />
                            <p className="text-gray-500">No registrations found matching your filters.</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {total > 50 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t border-manthan-gold/10">
                            <button
                                onClick={() => setPage(Math.max(1, page - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 text-sm text-manthan-gold disabled:text-gray-600 hover:bg-manthan-gold/10 rounded transition-colors"
                            >
                                Previous
                            </button>
                            <span className="text-gray-500 text-sm">Page {page} of {Math.ceil(total / 50)}</span>
                            <button
                                onClick={() => setPage(page + 1)}
                                disabled={page * 50 >= total}
                                className="px-4 py-2 text-sm text-manthan-gold disabled:text-gray-600 hover:bg-manthan-gold/10 rounded transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
