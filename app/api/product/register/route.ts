import { createToken } from '@/lib/jwt';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
    try {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        const { device_id } = await request.json();

        // Get user from session
        const authHeader = request.headers.get('authorization');
        const sessionCookie = request.cookies.get('sb-access-token') ||
            request.cookies.get('sb-jdvnlsobjurqwdcrztkq-auth-token');

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

        const { data, error } = await supabase
            .from('users')
            .select()
            .eq('id', user.id)
            .single();

        const tokenPayload = {
            user_id: user.id,
            device_id: device_id,
        };
        const deviceToken = createToken(tokenPayload);

        if (error && error.code === 'PGRST116') {
            console.error('Supabase error fetching user:', error);
            return NextResponse.json({ error: 'No Plan Subscribed', deviceToken }, { status: 403 });
        }

        if (!data.razorpay_subscription_id) {
            return NextResponse.json({ error: 'Missing subscription', deviceToken }, { status: 403 });
        }

        const { error: updateError } = await supabase
            .from('users')
            .update({
                device_id: device_id
            })
            .eq("id", user.id)

        if (updateError) {
            console.error('Error updating device ID:', updateError);
            return NextResponse.json({ error: 'Failed to register device' }, { status: 500 });
        }

        console.log(`Device ID ${device_id} registered for user ${user.id}`);

        return NextResponse.json({
            device_token: deviceToken,
            success: true,
            message: 'Product registered successfully',
        });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
