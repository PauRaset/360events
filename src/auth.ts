import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { createHash, timingSafeEqual } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { authConfig } from './auth.config';
import { prisma } from './lib/prisma';

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
      async authorize(credentials) {
        const email = String(credentials?.email ?? '').trim().toLowerCase();
        const password = String(credentials?.password ?? '');
        if (!email || !password) return null;

        // 1) Admin de bootstrap per variables d'entorn (superadmin).
        const adminEmail = (process.env.ADMIN_EMAIL ?? '').trim().toLowerCase();
        const adminPassword = process.env.ADMIN_PASSWORD ?? '';
        if (
          adminEmail &&
          adminPassword &&
          safeEqual(email, adminEmail) &&
          safeEqual(password, adminPassword)
        ) {
          return {
            id: 'admin-env',
            name: 'Administrador',
            email: adminEmail,
            rol: 'ADMIN',
            artistaId: null,
          };
        }

        // 2) Usuaris de la base de dades (admin o artista).
        const usuari = await prisma.usuari.findUnique({ where: { email } });
        if (!usuari) return null;
        const ok = await bcrypt.compare(password, usuari.passwordHash);
        if (!ok) return null;

        return {
          id: usuari.id,
          email: usuari.email,
          name: usuari.rol === 'ARTISTA' ? 'Artista' : 'Administrador',
          rol: usuari.rol,
          artistaId: usuari.artistaId,
        };
      },
    }),
  ],
});
