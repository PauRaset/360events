import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

// El middleware usa la config Edge-safe (sense el provider Credentials).
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ['/panell', '/panell/:path*'],
};
