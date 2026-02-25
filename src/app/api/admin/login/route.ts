import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
        }

        // Authenticate with Supabase Auth
        const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
            email,
            password,
        });

        if (authError || !authData.user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Check if user is in admin_users table
        const { data: adminUser, error: adminError } = await supabaseAdmin
            .from('admin_users')
            .select('*')
            .eq('id', authData.user.id)
            .single();

        if (adminError || !adminUser) {
            return NextResponse.json({ error: 'Not authorized as admin' }, { status: 403 });
        }

        return NextResponse.json({
            access_token: authData.session?.access_token,
            user: {
                id: adminUser.id,
                email: adminUser.email,
                role: adminUser.role,
                name: adminUser.name,
            },
        });
    } catch (err) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
