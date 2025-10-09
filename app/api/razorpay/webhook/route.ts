import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createHmac } from 'crypto';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      console.error('Missing Razorpay signature header');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // Get webhook secret
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('Missing RAZORPAY_WEBHOOK_SECRET');
      return NextResponse.json({ error: 'Webhook configuration error' }, { status: 500 });
    }

    // Verify signature using HMAC-SHA256
    const expectedSignature = createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Parse the webhook payload
    const payload = JSON.parse(rawBody);
    console.log('payload: ', payload);
    const { event, payload: eventPayload } = payload;

    // Create Supabase client with service role
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (event === 'subscription.activated') {
      const subscription = eventPayload.subscription;
      const entity = subscription.entity;

      // Extract user ID from notes
      const userId = entity.notes?.userId;
      if (!userId) {
        console.error('No userId found in subscription notes');
        return NextResponse.json({ received: true });
      }

      // Upsert profile with active subscription details
      const { error: updateError } = await supabase
        .from('users')
        .update({
          status: 'active',
          plan: 'pro-monthly',
          current_period_end: new Date(entity.current_end * 1000).toISOString(),
          razorpay_subscription_id: entity.id
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating profile on subscription activation:', updateError);
      } else {
        console.log('Profile updated for subscription activation:', userId);
      }

    } else if (event === 'subscription.cancelled') {
      const subscription = eventPayload.subscription;
      const entity = subscription.entity;

      // Extract user ID from notes
      const userId = entity.notes?.userId;
      if (!userId) {
        console.error('No userId found in subscription notes');
        return NextResponse.json({ received: true });
      }

      // Update profile status to cancelled
      const { error: updateError } = await supabase
        .from('users')
        .update({ status: 'cancelled', razorpay_subscription_id: null })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating profile on subscription cancellation:', updateError);
      } else {
        console.log('Profile updated for subscription cancellation:', userId);
      }
    } else if (event === 'subscription.charged') {
      const subscription = eventPayload.subscription;
      const entity = subscription.entity;
      const userId = entity.notes?.userId;
      if (!userId) {
        console.error('No userId found in subscription notes');
        return NextResponse.json({ received: true });
      }

      // Upsert profile with active subscription details
      const { error: updateError } = await supabase
        .from('users')
        .update({
          status: 'active',
          plan: 'pro-monthly',
          current_period_end: new Date(entity.current_end * 1000).toISOString(),
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating profile on subscription activation:', updateError);
      } else {
        console.log('Profile updated for subscription activation:', userId);
      }


    }
    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}