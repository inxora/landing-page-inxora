import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xdelryvybznwxdgulqfz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkZWxyeXZ5Ynpud3hkZ3VscWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MDQwNDgsImV4cCI6MjA2NzQ4MDA0OH0.KiGSRuFXy5djTGBIOeZAgTQI6psaF0n317N9WAylWTY';

// Validar que las variables estén presentes
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are missing');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
