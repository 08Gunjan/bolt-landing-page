import { supabase } from './supabaseClient';

export async function signInWithGoogle() {
  const redirectTo = `${window.location.origin}/auth/callback?redirect=/join`;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/auth/callback?redirect=/join` }
  });
  if (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
}

export async function signInWithEmail(email: string) {
  const redirectTo = `${window.location.origin}/auth/callback?redirect=/join`;
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${window.location.origin}/auth/callback?redirect=/join` }
  });
  if (error) {
    console.error("Error signing in with Email:", error);
    throw error;
  }
  // Show "check your email" state in UI
}
