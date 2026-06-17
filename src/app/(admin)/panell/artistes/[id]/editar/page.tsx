import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { AdminHeader } from '../../../AdminHeader';
import { ArtistaForm, type ArtistaFormData } from '../../ArtistaForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Editar artista',
  robots: { index: false, follow: false },
};

export default async function EditarArtistaPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session?.user) redirect('/panell');

  const artista = await prisma.artista.findUnique({ where: { id: params.id } });
  if (!artista) notFound();

  const initial: ArtistaFormData = {
    id: artista.id,
    nom: artista.nom,
    slug: artista.slug,
    categoria: artista.categoria,
    descripcio: artista.descripcio,
    riderTecnic: artista.riderTecnic ?? '',
    fotos: artista.fotos,
    videos: artista.videos,
    destacat: artista.destacat,
    actiu: artista.actiu,
  };

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
            Editar · {artista.nom}
          </h1>
        </div>
        <ArtistaForm mode="edit" initial={initial} />
      </main>
    </div>
  );
}
