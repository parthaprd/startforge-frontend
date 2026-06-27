import { createAuthClient } from 'better-auth/react';

// baseURL must point to where auth API calls go FROM THE BROWSER.
// With the Next.js rewrite proxy, /api/auth/* is proxied to the backend,
// so requests go to the same origin (localhost:3000) — cookies work correctly.
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
});

export const { signIn, signUp, signOut, useSession } = authClient;
