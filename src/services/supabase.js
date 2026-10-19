import { createClient } from '@supabase/supabase-js';

// Retrieve credentials from Vite environment variables or localStorage
const getCredential = (envKeys, storageKey) => {
  try {
    const keys = Array.isArray(envKeys) ? envKeys : [envKeys];
    for (const key of keys) {
      const envVal = import.meta.env[key];
      if (
        envVal &&
        !envVal.includes('placeholder') &&
        envVal !== 'https://your-project.supabase.co' &&
        envVal !== 'your-anon-key-here'
      ) {
        return envVal.trim();
      }
    }
    const stored = localStorage.getItem(storageKey);
    if (stored && stored.trim()) {
      return stored.trim();
    }
    return '';
  } catch {
    return '';
  }
};

export const supabaseUrl = getCredential(['VITE_SUPABASE_URL', 'SUPABASE_URL'], 'dj_supabase_url');
export const supabaseAnonKey = getCredential(['VITE_SUPABASE_ANON_KEY', 'SUPABASE_ANON_KEY'], 'dj_supabase_anon_key');

// Detect if real Supabase credentials are configured
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('placeholder') &&
  supabaseAnonKey !== 'your-anon-key-here'
);

// Instantiate client if configured, otherwise null
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

export const saveSupabaseCredentials = (url, anonKey) => {
  try {
    if (url && anonKey) {
      localStorage.setItem('dj_supabase_url', url.trim());
      localStorage.setItem('dj_supabase_anon_key', anonKey.trim());
      window.location.reload();
      return true;
    }
  } catch {
    return false;
  }
};

export const clearSupabaseCredentials = () => {
  try {
    localStorage.removeItem('dj_supabase_url');
    localStorage.removeItem('dj_supabase_anon_key');
    window.location.reload();
  } catch {}
};
