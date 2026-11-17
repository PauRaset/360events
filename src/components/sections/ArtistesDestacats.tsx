import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Reveal } from '@/components/ui/Reveal';
import { ArtistCard } from '@/components/ui/ArtistCard';
import { IconArrowRight } from '@/components/ui/Icons';

export async function ArtistesDestacats() {
  // Artistes destacats i actius; si no n'hi ha cap de destacat, mostrem els actius.
  let artistes = await prisma.artista.findMany({
    where: { actiu: true, destacat: true },
    orderBy: { nom: 'asc' },
    take: 3,
  });
  if (artistes.length === 0) {
    artistes = await prisma.artista.findMany({
      where: { actiu: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });
  }

  // Si encara no hi ha artistes, no mostrem la secció.
  if (artistes.length === 0) return null;

  return (
    <section className="relative py-24 sm:py-32">
      <div className="container-page">
        <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-electric-bright">
              Artistes destacats
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
              Talent per fer vibrar la teva festa
            </h2>
          </div>
          <Link
            href="/artistes"
            className="inline-flex items-center gap-2 text-sm font-semibold text-electric-bright transition-colors hover:text-platinum"
          >
            Veure tots els artistes
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {artistes.map((a, i) => (
            <Reveal key={a.id} delay={i * 0.1}>
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
      </div>
    </section>
  );
}
