import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAuthTokenKey = process.env.NEXT_PUBLIC_SUPABASE_AUTH_TOKEN_KEY!;

export async function POST(request: NextRequest) {
  try {
    // Create Supabase client with service role
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from session
    const authHeader = request.headers.get('authorization');
    const sessionCookie = request.cookies.get('sb-access-token') ||
      request.cookies.get(supabaseAuthTokenKey);

    if (!sessionCookie && !authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let user;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user: authUser }, error } = await supabase.auth.getUser(token);
      if (error || !authUser) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      user = authUser;
    } else {
      const { data: { user: cookieUser }, error } = await supabase.auth.getUser();
      if (error || !cookieUser) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      user = cookieUser;
    }

    // Get user's profile to find subscription ID
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('razorpay_subscription_id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile?.razorpay_subscription_id) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
    }

    // Get Razorpay credentials
    const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error('Missing Razorpay configuration');
      return NextResponse.json({ error: 'Payment configuration error' }, { status: 500 });
    }

    // Cancel subscription with Razorpay
    const razorpayResponse = await fetch(`https://api.razorpay.com/v1/subscriptions/${profile.razorpay_subscription_id}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cancel_at_cycle_end: false
      })
    });

    if (!razorpayResponse.ok) {
      const errorText = await razorpayResponse.text();
      console.error('Razorpay cancellation failed:', errorText);
      return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 });
    }

    // Update profile status to cancelled
    const { error: updateError } = await supabase
      .from('users')
      .update({ status: 'cancelled' })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating profile status:', updateError);
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}