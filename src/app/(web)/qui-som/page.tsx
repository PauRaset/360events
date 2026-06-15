import type { Metadata } from 'next';
import { PageHero } from '@/components/sections/PageHero';
import { CtaBand } from '@/components/sections/CtaBand';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import {
  IconMic,
  IconSparkles,
  IconSpeaker,
  IconHeart,
  IconBriefcase,
  IconConfetti,
  IconArrowRight,
} from '@/components/ui/Icons';

export function generateMetadata(): Metadata {
  return {
    title: 'Qui som',
    description:
      'Creem experiències úniques a través de la música, l’espectacle i la diversió. Coneix 360Events: contractació artística, producció i lloguer d’equips a Catalunya.',
    alternates: { canonical: '/qui-som' },
  };
}

const queFem = [
  {
    Icon: IconMic,
    title: 'Contractació artística',
    text: 'DJs, orquestres, solistes i espectacles seleccionats per encaixar amb cada moment i cada públic.',
  },
  {
    Icon: IconSparkles,
    title: 'Producció d’esdeveniments',
    text: 'Coordinem cada detall, de la idea al muntatge final, perquè tot surti rodó.',
  },
  {
    Icon: IconSpeaker,
    title: 'Lloguer d’equips de so i il·luminació',
    text: 'Material professional i tècnics per garantir una posada en escena impecable.',
  },
];

const arees = [
  { Icon: IconConfetti, label: 'Festes majors' },
  { Icon: IconHeart, label: 'Casaments' },
  { Icon: IconSparkles, label: 'Esdeveniments privats' },
  { Icon: IconBriefcase, label: 'Esdeveniments d’empresa' },
  { Icon: IconHeart, label: 'Celebracions familiars' },
  { Icon: IconBriefcase, label: 'Presentacions comercials' },
  { Icon: IconSparkles, label: 'Esdeveniments culturals' },
];

export default function QuiSomPage() {
  return (
    <>
      <PageHero
        eyebrow="Qui som"
        title={
          <>
            Creem experiències úniques a través de la{' '}
            <span className="heading-gradient">música, l’espectacle i la diversió</span>
          </>
        }
        subtitle="Som un equip català apassionat pels esdeveniments. Posem tot el nostre saber fer al servei de la teva celebració perquè només t’hagis de preocupar de gaudir."
      >
        <Button href="/contacte">
          Demana pressupost gratuït
          <IconArrowRight className="h-4 w-4" />
        </Button>
        <Button href="/artistes" variant="ghost">
          Veure artistes
        </Button>
      </PageHero>

      {/* Missió */}
      <section className="container-page py-16">
        <Reveal className="mx-auto max-w-3xl">
          <div className="panel p-8 sm:p-12">
            <h2 className="font-display text-2xl font-bold text-platinum sm:text-3xl">
              La nostra missió
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-text-gray">
              A 360Events convertim qualsevol esdeveniment en una experiència
              completa: música que connecta, espectacle que emociona i una
              producció tècnica que ho fa possible. Treballem arreu de Catalunya
              amb una mirada de 360°, cuidant cada detall des del primer contacte
              fins a l’última cançó.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Què fem */}
      <section className="container-page py-12">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-electric-bright">
            Què fem
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
            Tot l’espectacle, sota un mateix sostre
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {queFem.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <div className="panel group h-full p-7 transition-all duration-300 hover:border-electric/40 hover:shadow-glow-soft">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-electric/30 bg-electric/10 text-electric-bright">
                  <s.Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold text-platinum">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-gray">
                  {s.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Àrees */}
      <section className="container-page py-12">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-electric-bright">
            On treballem
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
            Cada celebració, la seva experiència
          </h2>
        </Reveal>
        <div className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-3">
          {arees.map((a, i) => (
            <Reveal key={a.label} delay={(i % 4) * 0.05}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-silver transition-colors hover:border-electric/40 hover:text-platinum">
                <a.Icon className="h-4 w-4 text-electric-bright" />
                {a.label}
              </span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Lema */}
      <section className="container-page py-16">
        <Reveal className="text-center">
          <p className="font-accent text-3xl text-silver sm:text-4xl">
            360º diversió · 360º experiència
          </p>
        </Reveal>
      </section>

      <CtaBand
        title="Fem realitat el teu esdeveniment?"
        text="Explica’ns la teva idea i et prepararem una proposta a mida, sense compromís."
        href="/contacte"
      />
    </>
  );
}
