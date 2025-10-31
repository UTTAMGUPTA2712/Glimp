// Mock authentication library (simulating Supabase)

import { supabase } from "./supabase"

export interface User {
  id: string
  name?: string | null
  email: string
  plan: string | null
  status: 'active' | 'inactive' | 'trialing' | 'cancelled' | 'deleted'
  current_period_end: string | null
  entitled: boolean
}

export async function signOut(): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Sign out error:', error);
  }
}

export async function getSession() {
  try {
    console.log('Getting session...');
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Error getting session:', error);
      return null;
    }

    console.log('Session found:', !!session);
    return session;
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
}