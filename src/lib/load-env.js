import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Parse and load .env.local manually for standalone scripts running outside Next.js
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  try {
    let envPath = path.resolve(process.cwd(), '.env.local');
    if (!fs.existsSync(envPath)) {
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      envPath = path.resolve(__dirname, '../../.env.local');
    }
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
