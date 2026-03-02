import { createClient } from '@supabase/supabase-js';

// Accessing environment variables in Astro
// We try to fallback gracefully if they are missing so it doesn't crash during build or dev without an .env
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY 

export const supabase = createClient(supabaseUrl, supabaseKey);

// Utility to check if Supabase is actually configured
export const isSupabaseConfigured = () => {
    return import.meta.env.PUBLIC_SUPABASE_URL !== undefined && import.meta.env.PUBLIC_SUPABASE_ANON_KEY !== undefined;
};

