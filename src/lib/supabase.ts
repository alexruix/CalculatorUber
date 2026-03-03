import { createClient } from '@supabase/supabase-js';

// Accessing environment variables in Astro
// We try to fallback gracefully if they are missing so it doesn't crash during build or dev without an .env
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || '';
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';

// Prevenimos que la app crashee si no hay variables de entorno (Modo Demo)
// Usamos placeholders para que createClient no lance un error fatal
export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co', 
    supabaseKey || 'placeholder'
);

// Utilidad para chequear si Supabase está realmente configurado
export const isSupabaseConfigured = () => {
    return !!import.meta.env.PUBLIC_SUPABASE_URL && !!import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
};

