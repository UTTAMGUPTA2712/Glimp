import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

  console.log('Auth callback received:', { 
    hasCode: !!code, 
    error, 
    errorDescription,
    url: requestUrl.toString(),
    searchParams: Object.fromEntries(requestUrl.searchParams.entries())
  });

  if (error) {
    console.error('OAuth error:', error, errorDescription);
    return NextResponse.redirect(`${requestUrl.origin}/login?error=${encodeURIComponent(error)}`);
  }

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    try {
      console.log('Exchanging code for session...');
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (exchangeError) {
        console.error('Code exchange error:', exchangeError);
        return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_exchange_failed`);
      }

      console.log('Code exchange successful:', { 
        userId: data.user?.id,
        hasSession: !!data.session 
      });

      // Get stored nonce or generate new one
      const storedNonce = request.cookies.get('oauth_nonce')?.value;
      const nonce = storedNonce || 'generated-' + Date.now();
      
      console.log('Redirecting to /app/start with nonce:', nonce);
      
      // Create response with redirect
      const response = NextResponse.redirect(`${requestUrl.origin}/app/start?nonce=${nonce}`);
      
      // Clear the nonce cookie if it exists
      if (storedNonce) {
        response.cookies.delete('oauth_nonce');
      }
      
      return response;
      
    } catch (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_callback_error`);
    }
  }

  // No code parameter - this might be an implicit flow callback
  // Redirect to a client-side handler that can process URL fragments
  console.log('No code parameter, redirecting to client-side auth handler');
  return NextResponse.redirect(`${requestUrl.origin}/auth/client-callback`);
}