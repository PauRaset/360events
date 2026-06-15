import { Reveal } from '@/components/ui/Reveal';
import { Counter } from '@/components/ui/Counter';
import {
  IconDisc,
  IconMic,
  IconSparkles,
  IconSpeaker,
} from '@/components/ui/Icons';

const pillars = [
  {
    Icon: IconDisc,
    title: 'DJs',
    text: 'Sessions per a tot tipus de públic, des de la cerimònia fins a la pista fins l’última cançó.',
  },
  {
    Icon: IconMic,
    title: 'Música en directe',
    text: 'Grups, solistes i bandes versàtils que omplen l’escenari d’energia.',
  },
  {
    Icon: IconSparkles,
    title: 'Espectacles & animació',
    text: 'Shows, performers i animació per sorprendre i emocionar els teus convidats.',
  },
  {
    Icon: IconSpeaker,
    title: 'So, llums & producció',
    text: 'Equips professionals i tècnics per a un muntatge impecable a qualsevol espai.',
  },
];

const stats = [
  { to: 500, suffix: '+', label: 'esdeveniments' },
  { to: 40, suffix: '+', label: 'artistes' },
  { to: 100, suffix: '%', label: 'Catalunya' },
  { to: 360, suffix: '°', label: 'experiència' },
];

export function QuiSom() {
  return (
    <section id="qui-som" className="relative py-24 sm:py-32">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-electric-bright">
            Qui som
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
            Tot l’espectacle, sota un mateix sostre
          </h2>
          <p className="mt-4 text-text-gray">
            A 360Events ens encarreguem de cada detall perquè tu només et
            preocupis de gaudir.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <div className="panel group h-full p-6 transition-all duration-300 hover:border-electric/40 hover:shadow-glow-soft">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-electric/30 bg-electric/10 text-electric-bright transition-colors group-hover:bg-electric/20">
                  <p.Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold text-platinum">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-gray">
                  {p.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Stats */}
        <Reveal delay={0.1}>
          <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center bg-base/40 px-4 py-8 text-center"
              >
                <dt className="font-display text-4xl font-extrabold text-platinum sm:text-5xl">
                  <Counter to={s.to} suffix={s.suffix} />
                </dt>
                <dd className="mt-2 text-sm uppercase tracking-wide text-text-gray">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
