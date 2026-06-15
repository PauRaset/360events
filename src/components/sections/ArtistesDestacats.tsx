import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';
import { GradientImage } from '@/components/ui/GradientImage';
import { IconArrowRight } from '@/components/ui/Icons';

const artists = [
  {
    name: 'La Montecarlo',
    tag: 'Grup versàtil',
    slug: 'la-montecarlo',
    from: '#0A2A66',
    to: '#1E7BFF',
  },
  {
    name: 'DJ Pep Masó',
    tag: 'DJ · Open format',
    slug: 'dj-pep-maso',
    from: '#080B16',
    to: '#3D93FF',
  },
  {
    name: 'Laia Manetti',
    tag: 'Veu en directe',
    slug: 'laia-manetti',
    from: '#0A2A66',
    to: '#0C1122',
  },
];

export function ArtistesDestacats() {
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
          {artists.map((a, i) => (
            <Reveal key={a.slug} delay={i * 0.1}>
              <Link
                href={`/artistes/${a.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-2xl border border-white/10"
              >
                <GradientImage
                  alt={`Foto de ${a.name}`}
                  from={a.from}
                  to={a.to}
                  className="transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-base via-base/30 to-transparent" />
                <div className="absolute inset-0 ring-0 ring-electric/0 transition-all duration-300 group-hover:shadow-glow-lg group-hover:ring-1 group-hover:ring-electric/40" />
                <div className="absolute bottom-0 left-0 w-full p-6">
                  <p className="text-xs uppercase tracking-widest text-electric-bright">
                    {a.tag}
                  </p>
                  <h3 className="mt-1 font-display text-xl font-bold text-white">
                    {a.name}
                  </h3>
                  <span className="mt-3 inline-flex translate-y-2 items-center gap-1.5 text-sm font-medium text-silver opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    Veure perfil <IconArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
