import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { AdminHeader } from '../../AdminHeader';
import { ArtistaForm } from '../ArtistaForm';

export const metadata: Metadata = {
  title: 'Nou artista',
  robots: { index: false, follow: false },
};

export default async function NouArtistaPage() {
  const session = await auth();
  if (!session?.user) redirect('/panell');

  return (
    <div className="min-h-screen">
      <AdminHeader email={session.user.email} />
      <main className="container-page py-8">
        <div className="mb-6">
          <Link
            href="/panell/artistes"
            className="text-sm text-text-gray hover:text-platinum"
          >
            ← Tornar a artistes
          </Link>
          <h1 className="mt-2 font-display text-2xl font-extrabold text-platinum">
            Nou artista
          </h1>
        </div>
        <ArtistaForm mode="create" />
      </main>
    </div>
  );
}
