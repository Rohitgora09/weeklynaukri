import { createClient } from '@supabase/supabase-js';

// Polyfill for WebSocket on older Node.js versions (Node < 22)
// Since we don't use Supabase Realtime subscriptions, we can safely mock the constructor.
if (typeof globalThis.WebSocket === 'undefined') {
  globalThis.WebSocket = class {};
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use service role key on server, or anon key on client browser
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("WARNING: Supabase URL or Key environment variables are missing!");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder-project.supabase.co', 
  supabaseKey || 'placeholder-key',
  {
    auth: {
      persistSession: typeof window !== 'undefined',
      autoRefreshToken: typeof window !== 'undefined'
    }
  }
);

