import { NextRequest, NextResponse } from 'next/server';
import { getDeviceLogin, markDeviceLoginClaimed } from '@/lib/database';
import { createDecipheriv } from 'crypto';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

function decryptPayload(encryptedData: string): string {
  const deviceEncKey = process.env.DEVICE_ENC_KEY;
  if (!deviceEncKey) {
    throw new Error('DEVICE_ENC_KEY not configured');
  }

  const key = Buffer.from(deviceEncKey, 'base64');
  
  // Extract IV (24 chars), authTag (32 chars), and encrypted data
  const iv = Buffer.from(encryptedData.slice(0, 24), 'hex');
  const authTag = Buffer.from(encryptedData.slice(24, 56), 'hex');
  const encrypted = encryptedData.slice(56);
  
  const decipher = createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const nonce = searchParams.get('nonce');

    if (!nonce) {
      return NextResponse.json({ error: 'Missing nonce' }, { status: 400 });
    }

    // Get device login entry
    const deviceLogin = await getDeviceLogin(nonce);

    if (!deviceLogin) {
      // Device login not found or expired
      return NextResponse.json({ error: 'Device login expired or not found' }, { status: 410 });
    }

    if (deviceLogin.claimed) {
      // Already claimed
      return NextResponse.json({ error: 'Device login already claimed' }, { status: 410 });
    }

    if (deviceLogin.status === 'pending') {
      // Still waiting for user to complete flow
      return new Response(null, { status: 204 });
    }

    if (deviceLogin.status === 'ready' && deviceLogin.payload) {
      // Mark as claimed and return the refresh token
      await markDeviceLoginClaimed(nonce);
      
      try {
        const decryptedPayload = decryptPayload(deviceLogin.payload);
        const payload = JSON.parse(decryptedPayload);
        return NextResponse.json({ refresh_token: payload.refresh_token });
      } catch (parseError) {
        console.error('Error parsing device login payload:', parseError);
        return NextResponse.json({ error: 'Invalid payload format' }, { status: 500 });
      }
    }

    // Fallback - should not reach here
    return new Response(null, { status: 204 });

  } catch (error) {
    console.error('Device poll error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}