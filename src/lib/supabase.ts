import { createClient } from '@supabase/supabase-js';
import { UserProfile } from '../types';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-supabase-project.supabase.co'
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Mock session state stored locally when Supabase environment variables are absent
const LOCAL_STORAGE_USER_KEY = 'rockguard_demo_user';

export async function getCurrentUser(): Promise<UserProfile | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        return {
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Safety Specialist',
          email: session.user.email || 'user@mine.gov.in',
          avatarUrl: session.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          role: 'Chief Mine Safety Engineer',
          sector: 'Jharia Sector B-12'
        };
      }
    } catch (err) {
      console.warn('Supabase session fetch error:', err);
    }
  }

  // Fallback to local storage user session
  const stored = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // ignore parse error
    }
  }

  return null;
}

export async function loginWithGoogle(): Promise<{ error?: string }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) return { error: error.message };
      return {};
    } catch (err: any) {
      return { error: err?.message || 'Google Auth Error' };
    }
  }

  // Fallback Demo Google Login
  const demoUser: UserProfile = {
    id: 'user-google-101',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@rockguard.mine.gov.in',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Chief Geotechnical Engineer',
    sector: 'Jharia Open-Pit Mine'
  };
  localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(demoUser));
  return {};
}

export async function loginWithEmail(email: string, pass: string): Promise<{ user?: UserProfile; error?: string }> {
  if (!email || !pass) {
    return { error: 'Please provide both email and password.' };
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass
      });
      if (error) return { error: error.message };
      if (data.user) {
        const userProfile: UserProfile = {
          id: data.user.id,
          name: data.user.user_metadata?.full_name || email.split('@')[0],
          email: data.user.email || email,
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          role: 'Mine Safety Officer',
          sector: 'Sector B-12'
        };
        return { user: userProfile };
      }
    } catch (err: any) {
      return { error: err?.message || 'Supabase authentication failed' };
    }
  }

  // Demo Email Authentication
  const demoUser: UserProfile = {
    id: 'user-email-202',
    name: email.split('@')[0].toUpperCase(),
    email: email,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'Senior Mining Engineer',
    sector: 'Jharia Sector B'
  };
  localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(demoUser));
  return { user: demoUser };
}

export async function logoutUser(): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Supabase logout error:', err);
    }
  }
  localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
}
