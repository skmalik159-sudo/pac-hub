import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// ------------------------------------------------------------------
// Apne Supabase project ka URL aur anon key yahan paste karen.
// Supabase dashboard -> Project Settings -> API mein milenge.
// ------------------------------------------------------------------
const SUPABASE_URL = 'https://YOUR-PROJECT-ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR-ANON-PUBLIC-KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

// Hum username-based login use karte hain (email ki bajaye).
// Supabase Auth email maangta hai, is liye har username se ek
// internal fake email bana dete hain — user ko ye kabhi nazar nahi aata.
export function usernameToEmail(username) {
  return `${username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '')}@pachub.internal`;
}
