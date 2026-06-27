import { createAuthClient } from 'better-auth/react';

// baseURL must point directly to the backend where Better Auth is running.
// In development this is localhost:5000; in production the deployed backend URL.
const backendURL =
  process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ||
  'http://localhost:5000';

export const authClient = createAuthClient({
  baseURL: backendURL,
});

export const { signIn, signUp, signOut, useSession } = authClient;
