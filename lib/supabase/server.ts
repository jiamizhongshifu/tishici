import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

function getSupabaseKeys() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error('Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }
  return { url, key };
}

// Use in Server Components (read-only cookies: avoids Next limitation)
export function createRSCClient() {
  const { url, key } = getSupabaseKeys();
  const cookieStore = cookies();
  return createServerClient(url, key, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      // No-ops in RSC to avoid "cookies can only be modified" error
      set() {},
      remove() {},
    },
  });
}

// Use in Route Handlers and Server Actions (cookies can be modified there)
export function createActionClient() {
  const { url, key } = getSupabaseKeys();
  const cookieStore = cookies();
  return createServerClient(url, key, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: '', ...options, maxAge: 0 });
      },
    },
  });
}
