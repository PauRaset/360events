import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { AdminHeader } from '../../AdminHeader';
import { PressupostForm, type PressupostFormData } from '../PressupostForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Nou pressupost',
  robots: { index: false, follow: false },
};

const pad = (n: number) => String(n).padStart(2, '0');
const toYmd = (d: Date) =>
  `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;

export default async function NouPressupostPage({
  searchParams,
}: {
  searchParams: { reservaId?: string };
}) {
  const session = await auth();
  const user = session?.user;
  if (!user) redirect('/panell');

  // Els admins poden triar artista; els artistes el tenen assignat.
  const artistes =
    user.rol === 'ADMIN'
      ? await prisma.artista.findMany({
          orderBy: { nom: 'asc' },
          select: { id: true, nom: true },
        })
      : undefined;

  // Precàrrega des d'una reserva, si s'indica ?reservaId=...
  let initial: PressupostFormData | undefined;
  const reservaId = searchParams.reservaId;
  if (reservaId) {
    const reserva = await prisma.reserva.findUnique({
      where: { id: reservaId },
    });
    // L'artista només pot partir de les seves pròpies reserves.
    const permès =
      reserva &&
      (user.rol === 'ADMIN' ||
        (user.rol === 'ARTISTA' && reserva.artistaId === user.artistaId));
    if (reserva && permès) {
      initial = {
        clientNom: reserva.nom,
        clientEmail: reserva.email,
        clientTelefon: reserva.telefon ?? '',
        tipusEvent: reserva.tipusEvent ?? '',
        dataEvent: toYmd(reserva.dataEvent),
        horaInici: '',
        ubicacio: reserva.ubicacio ?? '',
        concepte: '',
        condicions: '',
        importEuros: '',
        artistaId: reserva.artistaId ?? '',
        reservaId: reserva.id,
      };
    }
  }

  return (
    <div className="min-h-screen">
      <AdminHeader email={user.email} rol={user.rol} />
      <main className="container-page py-8">
        <div className="mb-6">
          <Link href="/panell/pressupostos" className="text-sm text-text-gray hover:text-platinum">
            ← Tornar a pressupostos
          </Link>
          <h1 className="mt-2 font-display text-2xl font-extrabold text-platinum">
            Nou pressupost
          </h1>
          {initial && (
            <p className="mt-1 text-sm text-text-gray">
              Creat a partir de la reserva de {initial.clientNom}. En signar-se,
              la reserva es confirmarà automàticament.
            </p>
          )}
        </div>
        <PressupostForm mode="create" artistes={artistes} initial={initial} />
      </main>
    </div>
  );
}
