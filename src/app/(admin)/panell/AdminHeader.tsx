'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Logo } from '@/components/ui/Logo';
import { cn } from '@/lib/utils';

const links = [
  { label: 'Reserves', href: '/panell/reserves' },
  { label: 'Artistes', href: '/panell/artistes' },
  { label: 'Equips', href: '/panell/equips' },
];

export function AdminHeader({ email }: { email?: string | null }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-base/80 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="flex items-center gap-1">
            {links.map((l) => {
              const active = pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                    active
                      ? 'bg-electric/15 text-platinum'
                      : 'text-text-gray hover:text-platinum',
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {email ? (
            <span className="hidden text-sm text-text-gray md:inline">
              {email}
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/panell' })}
            className="btn-ghost px-4 py-2.5 text-sm"
          >
            Tancar sessió
          </button>
        </div>
      </div>
    </header>
  );
}
