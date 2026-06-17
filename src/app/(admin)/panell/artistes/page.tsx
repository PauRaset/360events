import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { AdminHeader } from '../AdminHeader';
import { ArtistesAdminList, type ArtistaRow } from './ArtistesAdminList';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Artistes',
  robots: { index: false, follow: false },
};

export default async function ArtistesAdminPage() {
  const session = await auth();
  if (!session?.user) redirect('/panell');

  const artistes = await prisma.artista.findMany({
    orderBy: [{ destacat: 'desc' }, { nom: 'asc' }],
  });

  const rows: ArtistaRow[] = artistes.map((a) => ({
    id: a.id,
    nom: a.nom,
    categoria: a.categoria,
    foto: a.fotos[0] ?? null,
    actiu: a.actiu,
    destacat: a.destacat,
  }));

  return (
    <div className="min-h-screen">
      <AdminHeader email={session.user.email} />

      <main className="container-page py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-platinum">
              Artistes
            </h1>
            <p className="mt-1 text-sm text-text-gray">
              {rows.length} artista{rows.length === 1 ? '' : 's'} en total.
            </p>
          </div>
          <Link href="/panell/artistes/nou" className="btn-primary">
            Afegir artista
          </Link>
        </div>

        <ArtistesAdminList initial={rows} />
      </main>
    </div>
  );
}
