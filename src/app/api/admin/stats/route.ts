import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

async function verifyAdmin(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) return null;

    const { data: adminUser } = await supabaseAdmin
        .from('admin_users')
        .select('*')
        .eq('id', user.id)
        .single();

    return adminUser;
}

export async function GET(request: NextRequest) {
    const admin = await verifyAdmin(request);
    if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Total registrations
        const { count: totalRegistrations } = await supabaseAdmin
            .from('registrations')
            .select('*', { count: 'exact', head: true })
            .eq('payment_status', 'PAID');

        // Total revenue
        const { data: revenueData } = await supabaseAdmin
            .from('registrations')
            .select('total_amount')
            .eq('payment_status', 'PAID');

        const totalRevenue = revenueData?.reduce((sum, r) => sum + r.total_amount, 0) || 0;

        // Checked in count
        const { count: checkedIn } = await supabaseAdmin
            .from('registrations')
            .select('*', { count: 'exact', head: true })
            .eq('payment_status', 'PAID')
            .eq('checked_in', true);

        // Pending payments
        const { count: pendingPayments } = await supabaseAdmin
            .from('registrations')
            .select('*', { count: 'exact', head: true })
            .eq('payment_status', 'PENDING');

        // Events breakdown
        const { data: events } = await supabaseAdmin
            .from('events')
            .select('id, name, category, current_participants, max_participants');

        return NextResponse.json({
            stats: {
                totalRegistrations: totalRegistrations || 0,
                totalRevenue,
                checkedIn: checkedIn || 0,
                pendingPayments: pendingPayments || 0,
            },
            events: events || [],
        });
    } catch (err) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
