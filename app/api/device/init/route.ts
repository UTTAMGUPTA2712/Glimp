import { NextRequest, NextResponse } from 'next/server';
import { createDeviceLogin } from '@/lib/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nonce } = body;

    if (!nonce) {
      return NextResponse.json({ error: 'Missing nonce' }, { status: 400 });
    }

    // Set expiration to 10 minutes from now
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Create device login entry with empty payload initially
    const success = await createDeviceLogin(nonce, '', expiresAt);

    if (!success) {
      return NextResponse.json({ error: 'Failed to initialize device login' }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Device init error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}