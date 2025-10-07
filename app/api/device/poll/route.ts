import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const nonce = searchParams.get('nonce')

    if (!nonce) {
      return NextResponse.json(
        { error: 'Nonce required' },
        { status: 400 }
      )
    }

    // In real implementation:
    // 1. Check if nonce exists and not expired
    // 2. Return encrypted refresh token if ready (once only)
    // 3. Return 204 if still pending
    // 4. Return 410 if expired

    // Mock implementation - simulate different states
    const random = Math.random()

    if (random < 0.3) {
      // 30% chance - still pending
      return new NextResponse(null, { 
        status: 204,
        headers: {
          'Cache-Control': 'no-store',
        }
      })
    } else if (random < 0.9) {
      // 60% chance - return token
      return NextResponse.json(
        { refresh_token: 'mock_encrypted_token_' + Date.now() },
        { 
          status: 200,
          headers: {
            'Cache-Control': 'no-store',
          }
        }
      )
    } else {
      // 10% chance - expired
      return NextResponse.json(
        { error: 'Nonce expired' },
        { 
          status: 410,
          headers: {
            'Cache-Control': 'no-store',
          }
        }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to poll device status' },
      { status: 500 }
    )
  }
}