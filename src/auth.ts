import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { createHash, timingSafeEqual } from 'node:crypto';
import { authConfig } from './auth.config';

/** Comparació en temps constant (hash de longitud fixa per evitar fuites). */
function safeEqual(a: string, b: string) {
  const ha = createHash('sha256').update(a).digest();
  const hb = createHash('sha256').update(b).digest();
  return timingSafeEqual(ha, hb);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Correu', type: 'email' },
        password: { label: 'Contrasenya', type: 'password' },
      },
      authorize(credentials) {
        const email = String(credentials?.email ?? '').trim().toLowerCase();
        const password = String(credentials?.password ?? '');

        const adminEmail = (process.env.ADMIN_EMAIL ?? '').trim().toLowerCase();
        const adminPassword = process.env.ADMIN_PASSWORD ?? '';
        if (!adminEmail || !adminPassword) return null;

        const okEmail = safeEqual(email, adminEmail);
        const okPassword = safeEqual(password, adminPassword);
        if (okEmail && okPassword) {
          return { id: 'admin', name: 'Administrador', email: adminEmail };
        }
        return null;
      },
    }),
  ],
});
