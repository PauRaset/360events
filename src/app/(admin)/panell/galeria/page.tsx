import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { AdminHeader } from '../AdminHeader';
import { GaleriaAdmin, type FotoItem } from './GaleriaAdmin';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Galeria',
  robots: { index: false, follow: false },
};

export default async function GaleriaAdminPage() {
  const session = await auth();
  if (session?.user?.rol !== 'ADMIN') redirect('/panell');

  const fotos = await prisma.fotoGaleria.findMany({
    orderBy: [{ ordre: 'asc' }, { createdAt: 'asc' }],
  });
  const items: FotoItem[] = fotos.map((f) => ({ id: f.id, url: f.url }));

  return (
    <div className="min-h-screen">
      <AdminHeader email={session.user.email} rol={session.user.rol} />
      <main className="container-page py-8">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-extrabold text-platinum">
            Galeria
          </h1>
          <p className="mt-1 text-sm text-text-gray">
            Les fotos que afegeixis aquí es mostren a la pàgina pública{' '}
            <span className="text-silver">/galeria</span>. {items.length}{' '}
            foto{items.length === 1 ? '' : 's'}.
          </p>
        </div>
        <GaleriaAdmin initial={items} />
      </main>
    </div>
  );
}
