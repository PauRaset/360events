import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';
import { GradientImage } from '@/components/ui/GradientImage';
import {
  IconHeart,
  IconBriefcase,
  IconConfetti,
  IconArrowRight,
} from '@/components/ui/Icons';

const types = [
  {
    Icon: IconHeart,
    title: 'Casaments',
    text: 'Música i producció per a un dia únic, de la cerimònia a la festa.',
    href: '/casaments',
    from: '#0A2A66',
    to: '#1E7BFF',
  },
  {
    Icon: IconBriefcase,
    title: 'Esdeveniments d’empresa',
    text: 'Sopars, presentacions i festes corporatives amb un acabat professional.',
    href: '/esdeveniments-empresa',
    from: '#080B16',
    to: '#0A2A66',
  },
  {
    Icon: IconConfetti,
    title: 'Festes majors',
    text: 'Espectacle i potència per omplir places i envelats arreu de Catalunya.',
    href: '/festes-majors',
    from: '#0C1122',
    to: '#3D93FF',
  },
];

export function TipusEsdeveniment() {
  return (
    <section id="esdeveniments" className="relative py-24 sm:py-32">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-electric-bright">
            Tipus d’esdeveniment
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
            Cada celebració, la seva experiència 360°
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {types.map((t, i) => (
            <Reveal key={t.title} delay={i * 0.1}>
              <Link
                href={t.href}
                className="group relative block h-80 overflow-hidden rounded-2xl border border-white/10"
              >
                <GradientImage
                  alt={t.title}
                  from={t.from}
                  to={t.to}
                  className="opacity-70 transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-base via-base/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-platinum backdrop-blur">
                    <t.Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-display text-xl font-bold text-white">
                    {t.title}
                  </h3>
                  <p className="mt-2 text-sm text-silver">{t.text}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-electric-bright">
                    Saber-ne més <IconArrowRight className="h-4 w-4" />
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
