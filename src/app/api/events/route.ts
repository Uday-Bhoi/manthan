import { NextRequest, NextResponse } from 'next/server';
import { getActiveEvents } from '@/lib/events-catalog';

export async function GET(request: NextRequest) {
    try {
        return NextResponse.json({ events: getActiveEvents() }, { status: 200 });
    } catch (err) {
        console.error('Events API internal error:', err);
        return NextResponse.json(
            {
                error: 'Internal server error',
            },
            { status: 500 }
        );
    }
}
