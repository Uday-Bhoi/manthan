import { supabaseAdmin } from './supabase/server';

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 10; // max requests per window

export async function checkRateLimit(
    ip: string,
    endpoint: string
): Promise<{ allowed: boolean; remaining: number }> {
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();

    // Clean old entries
    await supabaseAdmin
        .from('rate_limits')
        .delete()
        .lt('window_start', windowStart);

    // Count recent requests
    const { count } = await supabaseAdmin
        .from('rate_limits')
        .select('*', { count: 'exact', head: true })
        .eq('ip_address', ip)
        .eq('endpoint', endpoint)
        .gte('window_start', windowStart);

    const currentCount = count || 0;

    if (currentCount >= MAX_REQUESTS) {
        return { allowed: false, remaining: 0 };
    }

    // Record this request
    await supabaseAdmin.from('rate_limits').insert({
        ip_address: ip,
        endpoint,
        window_start: new Date().toISOString(),
    });

    return { allowed: true, remaining: MAX_REQUESTS - currentCount - 1 };
}
