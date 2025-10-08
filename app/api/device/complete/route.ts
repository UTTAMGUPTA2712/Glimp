import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { setDeviceLoginReady } from '@/lib/database';
import { createCipheriv, randomBytes } from 'crypto';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function encryptPayload(data: string): string {
  const deviceEncKey = process.env.DEVICE_ENC_KEY;
  if (!deviceEncKey) {
    throw new Error('DEVICE_ENC_KEY not configured');
  }

  const key = Buffer.from(deviceEncKey, 'base64');
  const iv = randomBytes(12); // 96-bit IV for GCM
  const cipher = createCipheriv('aes-256-gcm', key, iv);

  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  // Return IV + authTag + encrypted data, all hex encoded
  return iv.toString('hex') + authTag.toString('hex') + encrypted;
}

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

    const body = await request.json();
    const { nonce } = body;

    if (!nonce) {
      return NextResponse.json({ error: 'Missing nonce' }, { status: 400 });
    }

    // Get a refresh token for the user
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !sessionData.session) {
      return NextResponse.json({ error: 'Failed to get session' }, { status: 500 });
    }

    // Create payload with refresh token
    const payloadData = JSON.stringify({
      refresh_token: sessionData.session.refresh_token,
      user_id: user.id
    });

    // Update device login to ready status with payload
    const success = await setDeviceLoginReady(nonce);

    if (!success) {
      return NextResponse.json({ error: 'Failed to complete device login' }, { status: 500 });
    }

    // Encrypt and update the payload separately
    const encryptedPayload = encryptPayload(payloadData);
    const { error: updateError } = await supabase
      .from('device_logins')
      .update({ payload: encryptedPayload })
      .eq('nonce', nonce);

    if (updateError) {
      console.error('Error updating device login payload:', updateError);
      return NextResponse.json({ error: 'Failed to save device login payload' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Device completion error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}