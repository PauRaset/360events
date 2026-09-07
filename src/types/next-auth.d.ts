import type { DefaultSession } from 'next-auth';
import type { RolUsuari } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: {
      rol?: RolUsuari;
      artistaId?: string | null;
    } & DefaultSession['user'];
  }
  interface User {
    rol?: RolUsuari;
    artistaId?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    rol?: RolUsuari;
    artistaId?: string | null;
  }
}
