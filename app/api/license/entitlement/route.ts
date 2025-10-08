import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  try {
    // Create Supabase client with service role for server-side operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get authentication from request
    const authHeader = request.headers.get('authorization');

    let user;

    if (authHeader) {
      // Use authorization header if present
      const token = authHeader.replace('Bearer ', '');
      const { data: { user: authUser }, error } = await supabase.auth.getUser(token);
      if (error || !authUser) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      user = authUser;
    } else {
      // Try to get session from cookies
      const cookieStore = cookies();
      const accessToken = cookieStore.get('sb-access-token') ||
        cookieStore.get('sb-jdvnlsobjurqwdcrztkq-auth-token');

      if (!accessToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const { data: { user: cookieUser }, error } = await supabase.auth.getUser(accessToken.value);
      if (error || !cookieUser) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      user = cookieUser;
    }

    // Load user's profile from the existing profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, plan, status, current_period_end, stripe_customer_id, stripe_subscription_id, deleted_at')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      console.log('No profile found for user:', user.id, 'treating as not entitled');
      // If profile doesn't exist, treat as not entitled
      return NextResponse.json({
        entitled: false,
        plan: null,
        status: null,
        current_period_end: null
      }, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    }

    console.log('Profile found:', {
      id: profile.id,
      status: profile.status,
      deleted_at: profile.deleted_at,
      current_period_end: profile.current_period_end
    });

    // Compute entitlement using the exact rule
    const now = new Date();
    const currentPeriodEnd = profile.current_period_end ? new Date(profile.current_period_end) : null;

    const entitled = !profile.deleted_at &&
      ['active', 'trialing'].includes(profile.status) &&
      currentPeriodEnd &&
      currentPeriodEnd > now;

    console.log('Entitlement calculation:', {
      deleted_at: profile.deleted_at,
      status: profile.status,
      statusValid: ['active', 'trialing'].includes(profile.status),
      currentPeriodEnd,
      periodEndValid: currentPeriodEnd && currentPeriodEnd > now,
      entitled
    });

    // Return the response with exact fields
    return NextResponse.json({
      entitled: Boolean(entitled),
      plan: profile.plan || null,
      status: profile.status || null,
      current_period_end: profile.current_period_end || null
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error('Entitlement API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}