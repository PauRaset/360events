import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { AdminHeader } from '../../../AdminHeader';
import { EquipForm, type EquipFormData } from '../../EquipForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Editar equip',
  robots: { index: false, follow: false },
};

export default async function EditarEquipPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session?.user) redirect('/panell');

  const equip = await prisma.equip.findUnique({ where: { id: params.id } });
  if (!equip) notFound();

  const initial: EquipFormData = {
    id: equip.id,
    nom: equip.nom,
    categoria: equip.categoria,
    descripcio: equip.descripcio ?? '',
    fotos: equip.fotos,
    destacat: equip.destacat,
    actiu: equip.actiu,
    ordre: equip.ordre,
  };

  return (
    <div className="min-h-screen">
      <AdminHeader email={session.user.email} />
      <main className="container-page py-8">
        <div className="mb-6">
          <Link
            href="/panell/equips"
            className="text-sm text-text-gray hover:text-platinum"
          >
            ← Tornar a equips
          </Link>
          <h1 className="mt-2 font-display text-2xl font-extrabold text-platinum">
            Editar · {equip.nom}
          </h1>
        </div>
        <EquipForm mode="edit" initial={initial} />
      </main>
    </div>
  );
}
