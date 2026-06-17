import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { AdminHeader } from '../AdminHeader';
import { EquipsAdminList, type EquipRow } from './EquipsAdminList';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Equips',
  robots: { index: false, follow: false },
};

export default async function EquipsAdminPage() {
  const session = await auth();
  if (!session?.user) redirect('/panell');

  const equips = await prisma.equip.findMany({
    orderBy: [{ categoria: 'asc' }, { ordre: 'asc' }, { nom: 'asc' }],
  });

  const rows: EquipRow[] = equips.map((e) => ({
    id: e.id,
    nom: e.nom,
    categoria: e.categoria,
    foto: e.fotos[0] ?? null,
    actiu: e.actiu,
    destacat: e.destacat,
  }));

  return (
    <div className="min-h-screen">
      <AdminHeader email={session.user.email} />

      <main className="container-page py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-platinum">
              Equips de lloguer
            </h1>
            <p className="mt-1 text-sm text-text-gray">
              {rows.length} equip{rows.length === 1 ? '' : 's'} en total.
            </p>
          </div>
          <Link href="/panell/equips/nou" className="btn-primary">
            Afegir equip
          </Link>
        </div>

        <EquipsAdminList initial={rows} />
      </main>
    </div>
  );
}
