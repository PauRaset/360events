import type { Metadata } from 'next';
import Image from 'next/image';
import { PageHero } from '@/components/sections/PageHero';
import { CtaBand } from '@/components/sections/CtaBand';
import { Reveal } from '@/components/ui/Reveal';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export function generateMetadata(): Metadata {
  return {
    title: 'Galeria',
    description:
      'Imatges dels esdeveniments produïts per 360Events arreu de Catalunya: música, espectacle i producció.',
    alternates: { canonical: '/galeria' },
  };
}

export default async function GaleriaPage() {
  const fotos = await prisma.fotoGaleria.findMany({
    where: { actiu: true },
    orderBy: [{ ordre: 'asc' }, { createdAt: 'asc' }],
  });

  return (
    <>
      <PageHero
        eyebrow="Galeria"
        title={
          <>
            Moments que parlen{' '}
            <span className="heading-gradient">per si sols</span>
          </>
        }
        subtitle="Una mostra de l’energia que portem a cada esdeveniment."
      />

      <section className="container-page py-12">
        {fotos.length === 0 ? (
          <p className="text-center text-text-gray">
            Aviat ompliarem aquest espai amb fotografies dels nostres
            esdeveniments.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            {fotos.map((foto, i) => (
              <Reveal key={foto.id} delay={(i % 3) * 0.06}>
                <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10">
                  <Image
                    src={foto.url}
                    alt={foto.titol ?? `Imatge de galeria ${i + 1}`}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-base/30 to-transparent" />
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <CtaBand
        title="Vols que el teu esdeveniment sigui el proper?"
        text="Demana’ns un pressupost i comencem a crear records que valguin la pena."
        href="/contacte"
      />
    </>
  );
}
