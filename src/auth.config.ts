import type { NextAuthConfig } from 'next-auth';
import type { RolUsuari } from '@prisma/client';

/** Prefixos només accessibles per a l'ADMIN. */
const ADMIN_ONLY = [
  '/panell/reserves',
  '/panell/artistes',
  '/panell/equips',
  '/panell/usuaris',
];

/**
 * Configuració base d'Auth.js, segura per al runtime Edge (sense dependències
 * de Node). El middleware la importa per protegir les rutes.
 */
export const authConfig = {
  trustHost: true,
  session: { strategy: 'jwt' },
  pages: { signIn: '/panell' },
  providers: [],
  callbacks: {
    // Portem el rol i l'artista a dins del token i la sessió.
    jwt({ token, user }) {
      if (user) {
        token.rol = user.rol;
        token.artistaId = user.artistaId ?? null;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.rol = token.rol as RolUsuari | undefined;
        session.user.artistaId = (token.artistaId as string | null) ?? null;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const user = auth?.user;
      const isLoggedIn = !!user;
      const rol = user?.rol;
      const { pathname } = nextUrl;
      const isLogin = pathname === '/panell';

      // Home d'entrada segons rol.
      const home = rol === 'ARTISTA' ? '/panell/agenda' : '/panell/reserves';

      if (isLogin) {
        if (isLoggedIn) return Response.redirect(new URL(home, nextUrl));
        return true;
      }

      if (pathname.startsWith('/panell')) {
        if (!isLoggedIn) return false; // redirigeix al login
        // Els artistes només poden accedir a la seva agenda.
        const esAdminOnly = ADMIN_ONLY.some((p) => pathname.startsWith(p));
        if (rol !== 'ADMIN' && esAdminOnly) {
          return Response.redirect(new URL('/panell/agenda', nextUrl));
        }
        return true;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
