import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// ------------------------------------------------------------------
// Apne Supabase project ka URL aur anon key yahan paste karen.
// Supabase dashboard -> Project Settings -> API mein milenge.
// ------------------------------------------------------------------
const SUPABASE_URL = 'https://jzzpqrvxicorswzzdgii.supabase.co';
   const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6enBxcnZ4aWNvcnN3enpkZ2lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxNTQyNjEsImV4cCI6MjA5ODczMDI2MX0.1DtglmDq_BCam17jNePpGTQmL7GXiPkC_mdoZ5vtpio';

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
