import { auth } from '@/lib/better-auth';
import { toNextJsHandler } from 'better-auth/next-js';

const { GET, POST, PUT, DELETE, PATCH } = toNextJsHandler(auth);

export { GET, POST, PUT, DELETE, PATCH };