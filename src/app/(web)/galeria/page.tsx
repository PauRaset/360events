import type { Metadata } from 'next';
import { PageHero } from '@/components/sections/PageHero';
import { CtaBand } from '@/components/sections/CtaBand';
import { Reveal } from '@/components/ui/Reveal';
import { GradientImage } from '@/components/ui/GradientImage';

export function generateMetadata(): Metadata {
  return {
    title: 'Galeria',
    description:
      'Imatges dels esdeveniments produïts per 360Events arreu de Catalunya: música, espectacle i producció.',
    alternates: { canonical: '/galeria' },
  };
}

// Placeholders amb degradats fins que tinguem fotografies reals.
const palette = [
  { from: '#0A2A66', to: '#1E7BFF' },
  { from: '#080B16', to: '#3D93FF' },
  { from: '#0A2A66', to: '#0C1122' },
  { from: '#0C1122', to: '#3D93FF' },
  { from: '#080B16', to: '#1E7BFF' },
];

const tiles = Array.from({ length: 12 }).map((_, i) => ({
  ...palette[i % palette.length],
  // Algunes peces més altes per donar ritme tipus masonry
  tall: i % 5 === 0 || i % 5 === 3,
}));

export default function GaleriaPage() {
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
        subtitle="Una mostra de l’energia que portem a cada esdeveniment. Aviat ompliarem aquest espai amb fotografies reals."
      />

      <section className="container-page py-12">
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {tiles.map((t, i) => (
            <Reveal key={i} delay={(i % 3) * 0.06} className="mb-4 break-inside-avoid">
              <div
                className={`relative w-full overflow-hidden rounded-2xl border border-white/10 ${
                  t.tall ? 'aspect-[3/4]' : 'aspect-square'
                }`}
              >
                <GradientImage
                  alt={`Imatge de galeria ${i + 1}`}
                  from={t.from}
                  to={t.to}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-base/40 to-transparent" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBand
        title="Vols que el teu esdeveniment sigui el proper?"
        text="Demana’ns un pressupost i comencem a crear records que valguin la pena."
        href="/contacte"
      />
    </>
  );
}
