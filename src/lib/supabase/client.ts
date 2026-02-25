import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Client-side Supabase client (uses anon key, respects RLS)
let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
    if (!_supabase) {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!url || !key) {
            throw new Error('Missing Supabase public environment variables');
        }
        _supabase = createClient(url, key);
    }
    return _supabase;
}

export const supabase = new Proxy({} as SupabaseClient, {
    get(_target, prop) {
        return (getSupabase() as any)[prop];
    },
});
