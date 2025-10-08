// Mock authentication library (simulating Supabase)

import { supabase } from "./supabase"
import { getProfile, type Profile, isEntitled } from "./database"

export interface User {
  id: string
  name?: string | null
  email: string
  plan: string | null
  status: 'active' | 'inactive' | 'trialing' | 'cancelled' | 'deleted'
  current_period_end: string | null
  entitled: boolean
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    console.log('Getting current user...');
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      console.log('No user found:', error?.message);
      return null;
    }

    console.log('User found:', user.id);
    const profile = await getProfile(user.id);

    return {
      id: user.id,
      email: user.email || '',
      plan: profile?.plan || null,
      status: profile?.status as any || 'inactive',
      current_period_end: profile?.current_period_end || null,
      entitled: profile ? isEntitled(profile) : false
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Sign in error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function signUp(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Sign up error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
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