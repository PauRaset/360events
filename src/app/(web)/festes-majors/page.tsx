import type { Metadata } from 'next';
import { PageHero } from '@/components/sections/PageHero';
import { FeatureGrid } from '@/components/sections/FeatureGrid';
import { CtaBand } from '@/components/sections/CtaBand';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { serviceJsonLd } from '@/lib/jsonld';
import {
  IconConfetti,
  IconMic,
  IconDisc,
  IconSpeaker,
  IconSparkles,
  IconArrowRight,
} from '@/components/ui/Icons';

const CTA_HREF = '/contacte?assumpte=Festa%20major';

export function generateMetadata(): Metadata {
  return {
    title: 'Festes majors',
    description:
      'Orquestres, DJs i producció completa de so i llums per a festes majors arreu de Catalunya. Omplim places i envelats d’espectacle.',
    alternates: { canonical: '/festes-majors' },
  };
}

const features = [
  {
    Icon: IconMic,
    title: 'Orquestres',
    text: 'Orquestres versàtils per fer ballar totes les generacions de la festa.',
  },
  {
    Icon: IconDisc,
    title: 'DJs',
    text: 'Sessions potents per a la nit jove i les sessions de tarda i matinada.',
  },
  {
    Icon: IconSparkles,
    title: 'Producció completa',
    text: 'Ens encarreguem de tota la logística artística i tècnica de la festa.',
  },
  {
    Icon: IconSpeaker,
    title: 'So i llums',
    text: 'Equips de gran format per omplir places i envelats amb garanties.',
  },
  {
    Icon: IconConfetti,
    title: 'Espectacles',
    text: 'Animació i shows per sorprendre el públic de totes les edats.',
  },
  {
    Icon: IconSparkles,
    title: 'Assessorament',
    text: 'T’ajudem a dissenyar la programació ideal per a la teva comissió.',
  },
];

export default function FestesMajorsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            serviceJsonLd({
              name: 'Artistes i producció per a festes majors',
              description:
                'Orquestres, DJs i producció completa de so i llums per a festes majors a Catalunya.',
              path: '/festes-majors',
            }),
          ),
        }}
      />

      <PageHero
        eyebrow="Festes majors"
        title={
          <>
            Fem vibrar la teva{' '}
            <span className="heading-gradient">festa major</span>
          </>
        }
        subtitle="Orquestres, DJs i una producció de so i llums a l’altura. Portem l’espectacle a places, envelats i carrers d’arreu de Catalunya."
      >
        <Button href={CTA_HREF}>
          Demana pressupost
          <IconArrowRight className="h-4 w-4" />
        </Button>
      </PageHero>

      <section className="container-page py-12">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
            Tot el que necessita la teva comissió
          </h2>
          <p className="mt-4 text-text-gray">
            D’artistes a producció tècnica, t’ho posem fàcil.
          </p>
        </Reveal>
        <FeatureGrid features={features} />
      </section>

      <CtaBand
        title="Prepares la propera festa major?"
        text="Explica’ns les dates i el pressupost i et proposem la millor programació."
        href={CTA_HREF}
      />
    </>
  );
}
