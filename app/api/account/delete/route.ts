import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    // Create Supabase client with service role
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from session
    const authHeader = request.headers.get('authorization');
    const sessionCookie = request.cookies.get('sb-access-token') ||
      request.cookies.get('sb-jdvnlsobjurqwdcrztkq-auth-token');

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

    // Get user's profile to check subscription status
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('status, stripe_subscription_id')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile for deletion:', profileError);
      // Continue with deletion even if profile fetch fails
    }

    // Cancel active subscription if it exists
    if (profile &&
      ['active', 'trialing'].includes(profile.status) &&
      profile.stripe_subscription_id) {

      const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

      if (razorpayKeyId && razorpayKeySecret) {
        try {
          const razorpayResponse = await fetch(`https://api.razorpay.com/v1/subscriptions/${profile.stripe_subscription_id}/cancel`, {
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
            console.error('Failed to cancel subscription during account deletion:', errorText);
            // Continue with account deletion even if subscription cancellation fails
          }
        } catch (error) {
          console.error('Error cancelling subscription during account deletion:', error);
          // Continue with account deletion even if subscription cancellation fails
        }
      }
    }

    // Soft delete the profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        status: 'deleted',
        deleted_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error soft-deleting profile:', updateError);
      return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}