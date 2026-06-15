import type { Metadata } from 'next';
import { PageHero } from '@/components/sections/PageHero';
import { FeatureGrid } from '@/components/sections/FeatureGrid';
import { CtaBand } from '@/components/sections/CtaBand';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { serviceJsonLd } from '@/lib/jsonld';
import {
  IconBriefcase,
  IconSparkles,
  IconSpeaker,
  IconMic,
  IconDisc,
  IconArrowRight,
} from '@/components/ui/Icons';

const CTA_HREF = "/contacte?assumpte=Esdeveniment%20d'empresa";

export function generateMetadata(): Metadata {
  return {
    title: 'Esdeveniments d’empresa',
    description:
      'Producció d’esdeveniments d’empresa a Catalunya: presentacions, gales, team buildings i llançaments de producte amb so i projecció professional.',
    alternates: { canonical: '/esdeveniments-empresa' },
  };
}

const features = [
  {
    Icon: IconBriefcase,
    title: 'Presentacions',
    text: 'So clar i projecció perquè el teu missatge arribi amb impacte.',
  },
  {
    Icon: IconSparkles,
    title: 'Gales',
    text: 'Producció elegant i espectacle per a sopars i lliuraments de premis.',
  },
  {
    Icon: IconMic,
    title: 'Team buildings',
    text: 'Animació, música i dinàmiques per connectar el teu equip.',
  },
  {
    Icon: IconSparkles,
    title: 'Llançaments de producte',
    text: 'Una posada en escena memorable per presentar la teva novetat.',
  },
  {
    Icon: IconSpeaker,
    title: 'So i projecció',
    text: 'Equips professionals i tècnics per garantir un resultat impecable.',
  },
  {
    Icon: IconDisc,
    title: 'Festa corporativa',
    text: 'DJ i pista de ball per tancar l’esdeveniment per tot el grup.',
  },
];

export default function EsdevenimentsEmpresaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            serviceJsonLd({
              name: 'Producció d’esdeveniments d’empresa',
              description:
                'Presentacions, gales, team buildings i llançaments de producte amb so i projecció a Catalunya.',
              path: '/esdeveniments-empresa',
            }),
          ),
        }}
      />

      <PageHero
        eyebrow="Esdeveniments d’empresa"
        title={
          <>
            Experiències corporatives{' '}
            <span className="heading-gradient">memorables</span>
          </>
        }
        subtitle="De la presentació a la festa final, produïm esdeveniments d’empresa amb un acabat professional que transmet la imatge de la teva marca."
      >
        <Button href={CTA_HREF}>
          Demana pressupost
          <IconArrowRight className="h-4 w-4" />
        </Button>
      </PageHero>

      <section className="container-page py-12">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
            Solucions per a cada format
          </h2>
          <p className="mt-4 text-text-gray">
            Ens adaptem als objectius i al to de la teva empresa.
          </p>
        </Reveal>
        <FeatureGrid features={features} />
      </section>

      <CtaBand
        title="Tens un esdeveniment d’empresa a la vista?"
        text="Explica’ns els teus objectius i et preparem una proposta professional a mida."
        href={CTA_HREF}
      />
    </>
  );
}
