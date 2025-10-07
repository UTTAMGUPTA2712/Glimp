import { supabase } from './supabase';

// Database types based on existing schema
export interface Profile {
  id: string;
  email: string;
  plan: string;
  status: string;
  current_period_end: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  deleted_at: string | null;
}

export interface DeviceLogin {
  nonce: string;
  status: 'pending' | 'ready';
  payload: string;
  claimed: boolean;
  expires_at: string;
}

// Entitlement check function
export function isEntitled(profile: Profile): boolean {
  if (profile.deleted_at) return false;
  if (!['active', 'trialing'].includes(profile.status)) return false;
  
  const currentPeriodEnd = new Date(profile.current_period_end);
  const now = new Date();
  
  return currentPeriodEnd > now;
}

// Profile operations
export async function getProfile(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, plan, status, current_period_end, stripe_customer_id, stripe_subscription_id, deleted_at')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No profile found
      }
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Database error fetching profile:', error);
    return null;
  }
}

export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (error) {
      console.error('Error updating profile:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Database error updating profile:', error);
    return false;
  }
}

// Device login operations
export async function createDeviceLogin(nonce: string, payload: string, expiresAt: Date): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('device_logins')
      .insert({
        nonce,
        status: 'pending',
        payload,
        claimed: false,
        expires_at: expiresAt.toISOString()
      });

    if (error) {
      console.error('Error creating device login:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Database error creating device login:', error);
    return false;
  }
}

export async function getDeviceLogin(nonce: string): Promise<DeviceLogin | null> {
  try {
    const { data, error } = await supabase
      .from('device_logins')
      .select('nonce, status, payload, claimed, expires_at')
      .eq('nonce', nonce)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No device login found
      }
      console.error('Error fetching device login:', error);
      return null;
    }

    // Check if expired
    const expiresAt = new Date(data.expires_at);
    const now = new Date();
    
    if (expiresAt <= now) {
      console.log('Device login expired:', nonce);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Database error fetching device login:', error);
    return null;
  }
}

export async function updateDeviceLogin(nonce: string, updates: Partial<DeviceLogin>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('device_logins')
      .update(updates)
      .eq('nonce', nonce);

    if (error) {
      console.error('Error updating device login:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Database error updating device login:', error);
    return false;
  }
}

export async function markDeviceLoginClaimed(nonce: string): Promise<boolean> {
  return updateDeviceLogin(nonce, { claimed: true });
}

export async function setDeviceLoginReady(nonce: string): Promise<boolean> {
  return updateDeviceLogin(nonce, { status: 'ready' });
}

// Cleanup expired device logins
export async function cleanupExpiredDeviceLogins(): Promise<void> {
  try {
    const { error } = await supabase
      .from('device_logins')
      .delete()
      .lt('expires_at', new Date().toISOString());

    if (error) {
      console.error('Error cleaning up expired device logins:', error);
    }
  } catch (error) {
    console.error('Database error cleaning up expired device logins:', error);
  }
}