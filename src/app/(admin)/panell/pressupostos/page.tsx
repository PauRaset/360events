import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { AdminHeader } from '../AdminHeader';
import { PressupostosList, type PressupostRow } from './PressupostosList';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Pressupostos',
  robots: { index: false, follow: false },
};

const pad = (n: number) => String(n).padStart(2, '0');
const toYmd = (d: Date) =>
  `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;

export default async function PressupostosPage() {
  const session = await auth();
  const user = session?.user;
  if (!user) redirect('/panell');

  const where =
    user.rol === 'ARTISTA' ? { artistaId: user.artistaId ?? '__none__' } : {};

  const pressupostos = await prisma.pressupost.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { artista: true },
  });

  const rows: PressupostRow[] = pressupostos.map((p) => ({
    id: p.id,
    codi: p.codi,
    token: p.token,
    estat: p.estat,
    clientNom: p.clientNom,
    dataEvent: toYmd(p.dataEvent),
    importCentims: p.importCentims,
    artistaNom: p.artista?.nom ?? null,
  }));

  return (
    <div className="min-h-screen">
      <AdminHeader email={user.email} rol={user.rol} />
      <main className="container-page py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-platinum">
              Pressupostos
            </h1>
            <p className="mt-1 text-sm text-text-gray">
              {rows.length} pressupost{rows.length === 1 ? '' : 'os'} en total.
            </p>
          </div>
          <Link href="/panell/pressupostos/nou" className="btn-primary">
            Nou pressupost
          </Link>
        </div>
        <PressupostosList initial={rows} />
      </main>
    </div>
  );
}
