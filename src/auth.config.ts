import type { NextAuthConfig } from 'next-auth';

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
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;
      const isLogin = pathname === '/panell';
      const isPanell = pathname.startsWith('/panell');

      // Si ja té sessió i va al login, l'enviem al tauler.
      if (isLogin && isLoggedIn) {
        return Response.redirect(new URL('/panell/reserves', nextUrl));
      }
      // Protegim tot el que penja de /panell excepte el propi login.
      if (isPanell && !isLogin) {
        return isLoggedIn;
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
