import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { Logo } from '@/components/ui/Logo';
import { SignOutButton } from '../SignOutButton';
import { ReservesBoard, type ReservaItem } from './ReservesBoard';
import type { EstatReservaValue } from '@/lib/schemas';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Reserves',
  robots: { index: false, follow: false },
};

export default async function ReservesPage() {
  const session = await auth();
  if (!session?.user) redirect('/panell');

  const reserves = await prisma.reserva.findMany({
    orderBy: { createdAt: 'desc' },
    include: { artista: true },
  });

  const items: ReservaItem[] = reserves.map((r) => ({
    id: r.id,
    nom: r.nom,
    telefon: r.telefon,
    email: r.email,
    tipusEvent: r.tipusEvent,
    dataEvent: r.dataEvent.toISOString(),
    ubicacio: r.ubicacio,
    assistents: r.assistents,
    missatge: r.missatge,
    servei: r.servei,
    artistaNom: r.artista?.nom ?? null,
    estat: r.estat as EstatReservaValue,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-base/80 backdrop-blur-xl">
        <div className="container-page flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="hidden text-sm text-text-gray sm:inline">
              · Panell de reserves
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-text-gray md:inline">
              {session.user.email}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="container-page py-8">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-extrabold text-platinum">
            Reserves
          </h1>
          <p className="mt-1 text-sm text-text-gray">
            {items.length} sol·licitud{items.length === 1 ? '' : 's'} en total.
          </p>
        </div>

        <ReservesBoard initial={items} />
      </main>
    </div>
  );
}
