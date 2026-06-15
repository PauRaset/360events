'use client';

import { signOut } from 'next-auth/react';

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: '/panell' })}
      className="btn-ghost px-4 py-2.5 text-sm"
    >
      Tancar sessió
    </button>
  );
}
