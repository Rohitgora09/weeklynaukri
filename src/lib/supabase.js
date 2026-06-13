import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Polyfill for WebSocket on older Node.js versions (Node < 22)
// Since we don't use Supabase Realtime subscriptions, we can safely mock the constructor.
if (typeof globalThis.WebSocket === 'undefined') {
  globalThis.WebSocket = class {};
}

// Parse and load .env.local manually for standalone scripts running outside Next.js
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      envContent.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let value = match[2] || '';
          if (value.trim().startsWith('"') && value.trim().endsWith('"')) value = value.trim().slice(1, -1);
          if (value.trim().startsWith("'") && value.trim().endsWith("'")) value = value.trim().slice(1, -1);
          process.env[key] = value.trim();
        }
      });
    }
  } catch (e) {
    console.warn("Failed to load .env.local file:", e.message);
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
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
