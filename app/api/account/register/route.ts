import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
    try {
        console.log('=== UPSERT USER (LOGIN/SIGNUP) API CALLED ===');

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const authHeader = request.headers.get('authorization');
        const sessionCookie = request.cookies.get('sb-access-token') ||
            request.cookies.get('sb-jdvnlsobjurqwdcrztkq-auth-token');

        console.log('Auth check:', { hasAuthHeader: !!authHeader, hasSessionCookie: !!sessionCookie });

        if (!sessionCookie && !authHeader) {
            console.error('No authentication found');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let user;
        if (authHeader) {
            const token = authHeader.replace('Bearer ', '');
            console.log('Using auth header token');
            const { data: { user: authUser }, error } = await supabase.auth.getUser(token);
            if (error || !authUser) {
                console.error('Auth header validation failed:', error);
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            user = authUser;
        } else {
            console.log('Using session cookie');
            const { data: { user: cookieUser }, error } = await supabase.auth.getUser();
            if (error || !cookieUser) {
                console.error('Session cookie validation failed:', error);
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            user = cookieUser;
        }

        console.log('User authenticated:', user.id);

        // Check if user already exists
        console.log('Checking if user exists in database...');
        const { data: existingUser, error: selectError } = await supabase
            .from('users')
            .select('id')
            .eq('id', user.id)
            .single();

        if (selectError && (selectError as any).code !== 'PGRST116') {
            // PGRST116 is returned by PostgREST for "No rows found" in some setups; handle generically
            console.error('Error checking user existence:', selectError);
            // continue if it's a "no rows" situation, otherwise return error
        }

        if (existingUser && existingUser.id) {
            console.log('User already exists, ending request.');
            return NextResponse.json({ ok: true, exists: true, user_id: user.id });
        }

        // Create user record (user did not exist)
        console.log('Creating new user record...');
        const payload: any = {
            id: user.id,
            email: user.email ?? null,
            created_at: new Date().toISOString(),
        };

        const { data: insertData, error: insertError } = await supabase
            .from('users')
            .insert(payload)
            .select();

        if (insertError) {
            console.error('Error creating user:', insertError);
            return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
        }

        console.log('User created successfully:', insertData);
        return NextResponse.json({ ok: true, created: true, user_id: user.id });

    } catch (error) {
        console.error('=== UPSERT USER ERROR ===');
        console.error('Error details:', error);
        console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}