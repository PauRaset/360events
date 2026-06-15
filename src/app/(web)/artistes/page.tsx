import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { ArtistCard } from '@/components/ui/ArtistCard';
import { Reveal } from '@/components/ui/Reveal';

// Sempre dades fresques de la BD (sense generació estàtica en build).
export const dynamic = 'force-dynamic';

export function generateMetadata(): Metadata {
  return {
    title: 'Artistes',
    description:
      'Descobreix els DJs, grups i espectacles que pots contractar amb 360Events per al teu esdeveniment a Catalunya.',
    alternates: { canonical: '/artistes' },
  };
}

export default async function ArtistesPage() {
  const artistes = await prisma.artista.findMany({
    where: { actiu: true },
    orderBy: [{ destacat: 'desc' }, { nom: 'asc' }],
  });

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="container-page relative pb-24 pt-36">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-electric-bright">
            Artistes
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">
            El millor talent per al teu esdeveniment
          </h1>
          <p className="mt-4 text-text-gray">
            DJs, grups i espectacles seleccionats per fer vibrar cada moment.
          </p>
        </Reveal>

        {artistes.length === 0 ? (
          <p className="mt-16 text-center text-text-gray">
            Aviat publicarem aquí el nostre catàleg d’artistes.
          </p>
        ) : (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {artistes.map((a, i) => (
              <Reveal key={a.id} delay={(i % 3) * 0.08}>
                <ArtistCard
                  slug={a.slug}
                  nom={a.nom}
                  tag={a.categoria}
                  index={i}
                  foto={a.fotos[0]}
                />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
