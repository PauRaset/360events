import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';
import { IconMic, IconSpeaker, IconSparkles } from '@/components/ui/Icons';

const services = [
  {
    Icon: IconMic,
    title: 'Contractació artística',
    text: 'DJs, grups, solistes i espectacles seleccionats per a cada moment.',
    href: '/artistes',
    chips: ['DJs', 'Música en directe', 'Tributs', 'Animació'],
  },
  {
    Icon: IconSpeaker,
    title: 'Lloguer d’equips',
    text: 'So i il·luminació professional per a esdeveniments petits i mitjans.',
    href: '/lloguer-equips',
    chips: ['So', 'Il·luminació', 'Escenaris', 'DJ booth'],
  },
  {
    Icon: IconSparkles,
    title: 'Producció',
    text: 'Coordinació tècnica i creativa de principi a fi del teu esdeveniment.',
    href: '/contacte',
    chips: ['Tècnics', 'Muntatge', 'Coordinació', 'Logística'],
  },
];

export function Serveis() {
  return (
    <section id="serveis" className="relative py-24 sm:py-32">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-electric-bright">
            Serveis
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
            Solucions 360° per al teu esdeveniment
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1}>
              <Link
                href={s.href}
                className="panel group relative block h-full overflow-hidden p-8 transition-all duration-300 hover:-translate-y-1 hover:border-electric/50 hover:shadow-glow-lg"
              >
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-electric/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-electric/30 bg-electric/10 text-electric-bright">
                  <s.Icon className="h-7 w-7" />
                </span>
                <h3 className="mt-6 font-display text-xl font-bold text-platinum">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-text-gray">
                  {s.text}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {s.chips.map((chip) => (
                    <li
                      key={chip}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-silver"
                    >
                      {chip}
                    </li>
                  ))}
                </ul>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
