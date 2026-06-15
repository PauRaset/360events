import type { Metadata } from 'next';
import { PageHero } from '@/components/sections/PageHero';
import { FeatureGrid } from '@/components/sections/FeatureGrid';
import { CtaBand } from '@/components/sections/CtaBand';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { serviceJsonLd } from '@/lib/jsonld';
import {
  IconHeart,
  IconSparkles,
  IconDisc,
  IconMic,
  IconSpeaker,
  IconArrowRight,
} from '@/components/ui/Icons';

const CTA_HREF = '/contacte?assumpte=Casament';

export function generateMetadata(): Metadata {
  return {
    title: 'Casaments',
    description:
      'Música, espectacle i producció per al vostre casament a Catalunya: cerimònia, còctel i festa amb DJ, música en directe i il·luminació d’ambient.',
    alternates: { canonical: '/casaments' },
  };
}

const features = [
  {
    Icon: IconHeart,
    title: 'Cerimònia',
    text: 'Música en directe i ambient sonor perquè el “sí, vull” sigui inoblidable.',
  },
  {
    Icon: IconSparkles,
    title: 'Còctel',
    text: 'Sons elegants i propers que acompanyen l’aperitiu i les converses.',
  },
  {
    Icon: IconDisc,
    title: 'Festa',
    text: 'DJ i pista de ball amb la millor selecció per fer ballar tots els convidats.',
  },
  {
    Icon: IconMic,
    title: 'Música en directe',
    text: 'Solistes, duets o grups versàtils per posar la nota d’emoció.',
  },
  {
    Icon: IconSpeaker,
    title: 'Il·luminació d’ambient',
    text: 'Llums càlides i efectes que transformen l’espai a cada moment.',
  },
  {
    Icon: IconSparkles,
    title: 'Producció completa',
    text: 'Ens coordinem amb el vostre espai i equip per cuidar cada detall.',
  },
];

export default function CasamentsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            serviceJsonLd({
              name: 'Música i producció per a casaments',
              description:
                'Cerimònia, còctel i festa amb DJ, música en directe i il·luminació d’ambient a Catalunya.',
              path: '/casaments',
            }),
          ),
        }}
      />

      <PageHero
        eyebrow="Casaments"
        title={
          <>
            La banda sonora del{' '}
            <span className="heading-gradient">vostre gran dia</span>
          </>
        }
        subtitle="De la cerimònia a l’última cançó, posem música, llums i emoció perquè el vostre casament sigui exactament com l’heu somiat."
      >
        <Button href={CTA_HREF}>
          Demana pressupost
          <IconArrowRight className="h-4 w-4" />
        </Button>
      </PageHero>

      <section className="container-page py-12">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
            Acompanyem cada moment
          </h2>
          <p className="mt-4 text-text-gray">
            Adaptem la música i la producció a l’estil del vostre casament.
          </p>
        </Reveal>
        <FeatureGrid features={features} />
      </section>

      <CtaBand
        title="Comencem a imaginar el vostre casament?"
        text="Expliqueu-nos com us imagineu el dia i us prepararem una proposta a mida."
        href={CTA_HREF}
      />
    </>
  );
}
