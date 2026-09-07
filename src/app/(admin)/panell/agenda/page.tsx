import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { AdminHeader } from '../AdminHeader';
import { AvailabilityCalendar } from '@/components/AvailabilityCalendar';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'La meva agenda',
  robots: { index: false, follow: false },
};

const pad = (n: number) => String(n).padStart(2, '0');
const toYmd = (d: Date) =>
  `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;

export default async function AgendaPage() {
  const session = await auth();
  if (!session?.user) redirect('/panell');

  // L'agenda és per a artistes. Un admin sense artista va al seu tauler.
  const artistaId = session.user.artistaId;
  if (session.user.rol !== 'ARTISTA' || !artistaId) {
    redirect('/panell/reserves');
  }

  const artista = await prisma.artista.findUnique({ where: { id: artistaId } });
  if (!artista) redirect('/panell');

  const dies = await prisma.disponibilitat.findMany({
    where: { artistaId },
    orderBy: { data: 'asc' },
  });
  const blocked = dies.map((d) => toYmd(d.data));

  return (
    <div className="min-h-screen">
      <AdminHeader email={session.user.email} rol="ARTISTA" />

      <main className="container-page py-8">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-extrabold text-platinum">
            La meva agenda
          </h1>
          <p className="mt-1 text-sm text-text-gray">
            Hola, {artista.nom}. Marca els dies que estàs <strong>ocupat</strong>{' '}
            perquè els clients vegin la teva disponibilitat i evitem trucades
            innecessàries.
          </p>
        </div>

        <div className="max-w-xl">
          <AvailabilityCalendar
            artistaId={artistaId}
            initialBlocked={blocked}
            editable
          />
        </div>
      </main>
    </div>
  );
}
