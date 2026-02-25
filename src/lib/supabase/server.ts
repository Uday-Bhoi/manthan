import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Server-side Supabase client (uses service role key, bypasses RLS)
// ONLY use this in API routes and server-side code
// Lazily initialized to prevent build-time errors when env vars are not set

let _supabaseAdmin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
    if (!_supabaseAdmin) {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!url || !key) {
            throw new Error('Missing Supabase environment variables');
        }
        _supabaseAdmin = createClient(url, key, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        });
    }
    return _supabaseAdmin;
}

// Convenience getter - use this in route handlers
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
    get(_target, prop) {
        return (getSupabaseAdmin() as any)[prop];
    },
});
