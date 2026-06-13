import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  // Graceful warning during build time (if env keys aren't set in CI/CD yet)
  console.warn("WARNING: Supabase URL or Service Role key environment variables are missing!");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder-project.supabase.co', 
  supabaseServiceKey || 'placeholder-key',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);
