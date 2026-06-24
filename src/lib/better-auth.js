import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { nextCookies } from 'better-auth/next-js';
import { MongoClient } from 'mongodb';

// IMPORTANT: this Better Auth instance MUST mirror the backend's
// (src/config/auth.js) — same additionalFields, same secret, same DB.
// Otherwise users/sessions created here are invisible to the backend API.
const parseList = (value) =>
  String(value || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

const isProd = process.env.NODE_ENV === 'production';

// The mongodb adapter needs a connected MongoDB `Db` object, NOT a
// connection string. We open one shared MongoClient (cached on global so
// Next.js dev hot-reloads don't leak connections) and pass client.db().
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/startupforge';
const DB_NAME = process.env.DB_NAME || 'startupforge';

const globalForMongo = globalThis;
if (!globalForMongo._betterAuthMongoClient) {
  globalForMongo._betterAuthMongoClient = new MongoClient(MONGODB_URI, {
    serverApi: { version: '1', strictMode: false, deprecationErrors: false },
  });
}
const mongoClient = globalForMongo._betterAuthMongoClient;
// mongodb v7 queues commands until connect() resolves, so this is safe to
// pass in synchronously; the connection is established lazily on first use.
mongoClient.connect().catch((err) => {
  console.error('[better-auth] MongoDB connect failed:', err.message);
});
const db = mongoClient.db(DB_NAME);

export const auth = betterAuth({
  secret:
    process.env.BETTER_AUTH_SECRET ||
    'development-secret-key-at-least-32-characters',
  database: mongodbAdapter(db),
  baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    autoSignIn: true,
    minPasswordLength: 6,
  },
  socialProviders: {
    google: {
      enabled: !!process.env.GOOGLE_CLIENT_ID,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  // Must match the backend's additionalFields exactly so the user document
  // shape is identical across both services.
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'collaborator',
        input: true,
      },
      isBlocked: {
        type: 'boolean',
        required: false,
        defaultValue: false,
        input: false,
      },
      isPremium: {
        type: 'boolean',
        required: false,
        defaultValue: false,
        input: false,
      },
      premiumExpiresAt: {
        type: 'date',
        required: false,
        input: false,
      },
      bio: { type: 'string', required: false, input: true },
      skills: { type: 'string[]', required: false, input: true },
      portfolio: { type: 'string', required: false, input: true },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  trustedOrigins: parseList(process.env.TRUSTED_ORIGINS),
  advanced: {
    defaultCookieAttributes: {
      sameSite: isProd ? 'none' : 'lax',
      secure: isProd,
    },
  },
  plugins: [nextCookies()],
});