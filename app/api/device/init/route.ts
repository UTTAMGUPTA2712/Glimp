import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Generate a unique nonce
    const nonce = 'nonce_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)

    // In real implementation, store nonce in database with expiry
    // For now, just return the nonce

    return NextResponse.json(
      { ok: true, nonce },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
        }
      }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate nonce' },
      { status: 500 }
    )
  }
}