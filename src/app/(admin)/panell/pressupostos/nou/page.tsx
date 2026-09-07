import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { AdminHeader } from '../../AdminHeader';
import { PressupostForm } from '../PressupostForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Nou pressupost',
  robots: { index: false, follow: false },
};

export default async function NouPressupostPage() {
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
        </div>
        <PressupostForm mode="create" artistes={artistes} />
      </main>
    </div>
  );
}
