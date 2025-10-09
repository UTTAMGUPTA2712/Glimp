import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    console.log('=== CREATE CHECKOUT SESSION API CALLED ===');

    // Create Supabase client with service role
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from session
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

    // Check if user already has an active subscription
    console.log('Checking existing subscription...');
    const { data: existingProfile, error: profileError } = await supabase
      .from('users')
      .select('razorpay_subscription_id, status, current_period_end, deleted_at')
      .eq('id', user.id)
      .single();

    if (!profileError && existingProfile) {
      console.log('Existing profile found:', existingProfile);
      // Check if user is already entitled
      const now = new Date();
      const currentPeriodEnd = existingProfile.current_period_end ? new Date(existingProfile.current_period_end) : null;

      const entitled = !existingProfile.deleted_at &&
        ['active', 'trialing'].includes(existingProfile.status) &&
        currentPeriodEnd &&
        currentPeriodEnd > now;

      if (entitled) {
        console.log('User already entitled, rejecting subscription creation');
        return NextResponse.json({ error: 'User already has active subscription' }, { status: 400 });
      }
    } else {
      console.log('No existing profile found or profile error:', profileError);
    }

    // Get environment variables
    const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
    const razorpayPlanId = process.env.RAZORPAY_PLAN_ID;

    console.log('Environment variables check:', {
      hasKeyId: !!razorpayKeyId,
      hasKeySecret: !!razorpayKeySecret,
      hasPlanId: !!razorpayPlanId,
      keyId: razorpayKeyId?.substring(0, 10) + '...',
      planId: razorpayPlanId
    });

    if (!razorpayKeyId || !razorpayKeySecret || !razorpayPlanId) {
      console.error('Missing Razorpay configuration');
      return NextResponse.json({ error: 'Payment configuration error' }, { status: 500 });
    }

    // Create Razorpay subscription
    console.log('Creating Razorpay subscription...');
    const subscriptionPayload = {
      plan_id: razorpayPlanId,
      customer_notify: 1,
      total_count: 12,
      notes: {
        userId: user.id
      }
    };
    console.log('Subscription payload:', subscriptionPayload);

    const razorpayResponse = await fetch('https://api.razorpay.com/v1/subscriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscriptionPayload)
    });

    console.log('Razorpay API response status:', razorpayResponse.status);

    if (!razorpayResponse.ok) {
      const errorText = await razorpayResponse.text();
      console.error('Razorpay subscription creation failed:', {
        status: razorpayResponse.status,
        statusText: razorpayResponse.statusText,
        error: errorText
      });
      return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
    }

    const subscription = await razorpayResponse.json();
    console.log('subscription: ', subscription);
    console.log('Razorpay subscription created:', {
      id: subscription.id,
      status: subscription.status,
      plan_id: subscription.plan_id
    });

    // Store subscription ID in users table
    console.log('Storing subscription ID in database...');
    const { error: updateError } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        email: user.email,
        razorpay_customer_id: subscription.customer_id,
        razorpay_subscription_id: subscription.id,
        plan: 'pro-monthly',
        status: 'created'
      }, {
        onConflict: 'id'
      });

    if (updateError) {
      console.error('Error storing subscription in database:', updateError);
      return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 });
    }

    console.log('Subscription stored successfully, returning subscription ID');
    return NextResponse.json({ subscription_id: subscription.id });

  } catch (error) {
    console.error('=== CREATE CHECKOUT SESSION ERROR ===');
    console.error('Error details:', error);
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}