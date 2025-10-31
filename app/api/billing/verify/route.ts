import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createHmac } from 'crypto';

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
    console.log('request.headers: ', request.headers);
    const authHeader = request.headers.get('authorization');
    const sessionCookie = request.cookies.get('sb-access-token') || request.cookies.get(supabaseAuthTokenKey);

    console.log('sessionCookie: ', sessionCookie);
    console.log('authHeader: ', authHeader);
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

    const body = await request.json();
    const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } = body;

    if (!razorpay_payment_id || !razorpay_subscription_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get Razorpay key secret
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!razorpayKeySecret) {
      console.error('Missing RAZORPAY_KEY_SECRET');
      return NextResponse.json({ error: 'Payment configuration error' }, { status: 500 });
    }

    // Verify signature using HMAC-SHA256
    const expectedSignature = createHmac('sha256', razorpayKeySecret)
      .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.error('Invalid Razorpay signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Optimistically mark profile as created
    const { error: updateError } = await supabase
      .from('users')
      .update({ status: 'created' })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating profile status:', updateError);
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error('Verify payment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}