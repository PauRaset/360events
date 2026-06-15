import type { Metadata } from 'next';
import { PageHero } from '@/components/sections/PageHero';
import { CtaBand } from '@/components/sections/CtaBand';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { serviceJsonLd } from '@/lib/jsonld';
import {
  IconSpeaker,
  IconDisc,
  IconSparkles,
  IconConfetti,
  IconMic,
  IconArrowRight,
} from '@/components/ui/Icons';

const CTA_HREF = "/contacte?assumpte=Lloguer%20d'equips";

export function generateMetadata(): Metadata {
  return {
    title: 'Lloguer d’equips',
    description:
      'Lloguer d’equips de so, DJ, il·luminació, estructures i efectes especials per a esdeveniments petits i mitjans a Catalunya.',
    alternates: { canonical: '/lloguer-equips' },
  };
}

const categories = [
  {
    Icon: IconSpeaker,
    title: 'So',
    text: 'Sistemes de so professionals i potents, fàcils d’integrar a qualsevol espai.',
    items: ['DAP Audio MK2', 'Bose L1 Pro'],
  },
  {
    Icon: IconDisc,
    title: 'DJ',
    text: 'Equip de cabina llest per punxar, fiable i intuïtiu per a qualsevol DJ.',
    items: ['Controladors Pioneer XDJ-RR'],
  },
  {
    Icon: IconSparkles,
    title: 'Il·luminació',
    text: 'Llums dinàmiques per crear ambient i transformar l’espai.',
    items: ['Caps mòbils LED Beam', 'Sistemes d’il·luminació LED'],
  },
  {
    Icon: IconConfetti,
    title: 'Estructures',
    text: 'Estructures modulars il·luminades per donar volum i impacte visual.',
    items: ['Estructures modulars il·luminades amb funda de licra'],
  },
  {
    Icon: IconSparkles,
    title: 'Efectes especials',
    text: 'El toc espectacular per als moments més importants de la nit.',
    items: ['Foc fred'],
  },
  {
    Icon: IconMic,
    title: 'Accessoris',
    text: 'Tot el complement necessari perquè no falti cap detall.',
    items: ['Micròfons i accessoris'],
  },
];

export default function LloguerEquipsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            serviceJsonLd({
              name: 'Lloguer d’equips de so i il·luminació',
              description:
                'Lloguer d’equips de so, DJ, il·luminació, estructures i efectes especials a Catalunya.',
              path: '/lloguer-equips',
            }),
          ),
        }}
      />

      <PageHero
        eyebrow="Lloguer d’equips"
        title={
          <>
            So i il·luminació{' '}
            <span className="heading-gradient">professional</span> per al teu
            esdeveniment
          </>
        }
        subtitle="Material de qualitat per a esdeveniments petits i mitjans. Te’l portem, el muntem i ens n’encarreguem perquè tot soni i llueixi perfecte."
      >
        <Button href={CTA_HREF}>
          Demana pressupost
          <IconArrowRight className="h-4 w-4" />
        </Button>
      </PageHero>

      <section className="container-page py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <Reveal key={c.title} delay={(i % 3) * 0.08}>
              <div className="panel group h-full p-7 transition-all duration-300 hover:-translate-y-1 hover:border-electric/40 hover:shadow-glow-soft">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-electric/30 bg-electric/10 text-electric-bright">
                  <c.Icon className="h-6 w-6" />
                </span>
                <h2 className="mt-5 font-display text-xl font-bold text-platinum">
                  {c.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-text-gray">
                  {c.text}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {c.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-silver"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBand
        title="Necessites equip per a la teva festa?"
        text="Digues-nos què necessites i et passem un pressupost de lloguer a mida."
        href={CTA_HREF}
      />
    </>
  );
}
