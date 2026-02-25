import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
    try {
        const { data, error } = await supabaseAdmin
            .from('events')
            .select('*')
            .eq('is_active', true)
            .order('event_date', { ascending: true });

        if (error) {
            return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
        }

        return NextResponse.json({ events: data }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
