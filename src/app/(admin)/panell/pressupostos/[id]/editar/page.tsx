import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { AdminHeader } from '../../../AdminHeader';
import { PressupostForm, type PressupostFormData } from '../../PressupostForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Editar pressupost',
  robots: { index: false, follow: false },
};

const pad = (n: number) => String(n).padStart(2, '0');
const toYmd = (d: Date) =>
  `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;

export default async function EditarPressupostPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  const user = session?.user;
  if (!user) redirect('/panell');

  const p = await prisma.pressupost.findUnique({ where: { id: params.id } });
  if (!p) notFound();

  // Ownership: admin o l'artista propietari.
  const owner =
    user.rol === 'ADMIN' ||
    (user.rol === 'ARTISTA' && p.artistaId === user.artistaId);
  if (!owner) redirect('/panell/pressupostos');
  if (p.estat !== 'ESBORRANY') redirect('/panell/pressupostos');

  const artistes =
    user.rol === 'ADMIN'
      ? await prisma.artista.findMany({
          orderBy: { nom: 'asc' },
          select: { id: true, nom: true },
        })
      : undefined;

  const initial: PressupostFormData = {
    id: p.id,
    clientNom: p.clientNom,
    clientEmail: p.clientEmail,
    clientTelefon: p.clientTelefon ?? '',
    tipusEvent: p.tipusEvent ?? '',
    dataEvent: toYmd(p.dataEvent),
    horaInici: p.horaInici ?? '',
    ubicacio: p.ubicacio ?? '',
    concepte: p.concepte,
    condicions: p.condicions ?? '',
    importEuros: (p.importCentims / 100).toString(),
    artistaId: p.artistaId ?? '',
  };

  return (
    <div className="min-h-screen">
      <AdminHeader email={user.email} rol={user.rol} />
      <main className="container-page py-8">
        <div className="mb-6">
          <Link href="/panell/pressupostos" className="text-sm text-text-gray hover:text-platinum">
            ← Tornar a pressupostos
          </Link>
          <h1 className="mt-2 font-display text-2xl font-extrabold text-platinum">
            Editar · {p.codi}
          </h1>
        </div>
        <PressupostForm mode="edit" initial={initial} artistes={artistes} />
      </main>
    </div>
  );
}
