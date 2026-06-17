import type { Metadata } from 'next';
import type { SVGProps, ComponentType } from 'react';
import { PageHero } from '@/components/sections/PageHero';
import { CtaBand } from '@/components/sections/CtaBand';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { GradientImage } from '@/components/ui/GradientImage';
import { serviceJsonLd } from '@/lib/jsonld';
import { CATEGORIES_EQUIP } from '@/lib/schemas';
import { prisma } from '@/lib/prisma';
import {
  IconSpeaker,
  IconDisc,
  IconSparkles,
  IconConfetti,
  IconMic,
  IconArrowRight,
} from '@/components/ui/Icons';

export const dynamic = 'force-dynamic';

const CTA_HREF = "/contacte?assumpte=Lloguer%20d'equips";

export function generateMetadata(): Metadata {
  return {
    title: 'Lloguer d’equips',
    description:
      'Lloguer d’equips de so, DJ, il·luminació, estructures i efectes especials per a esdeveniments petits i mitjans a Catalunya.',
    alternates: { canonical: '/lloguer-equips' },
  };
}

// Metadades (icona + text) per a cada categoria fixa.
const categoriaMeta: Record<
  string,
  { Icon: ComponentType<SVGProps<SVGSVGElement>>; text: string }
> = {
  So: {
    Icon: IconSpeaker,
    text: 'Sistemes de so professionals i potents, fàcils d’integrar a qualsevol espai.',
  },
  DJ: {
    Icon: IconDisc,
    text: 'Equip de cabina llest per punxar, fiable i intuïtiu per a qualsevol DJ.',
  },
  'Il·luminació': {
    Icon: IconSparkles,
    text: 'Llums dinàmiques per crear ambient i transformar l’espai.',
  },
  Estructures: {
    Icon: IconConfetti,
    text: 'Estructures modulars il·luminades per donar volum i impacte visual.',
  },
  'Efectes especials': {
    Icon: IconSparkles,
    text: 'El toc espectacular per als moments més importants de la nit.',
  },
  Accessoris: {
    Icon: IconMic,
    text: 'Tot el complement necessari perquè no falti cap detall.',
  },
};

export default async function LloguerEquipsPage() {
  const equips = await prisma.equip.findMany({
    where: { actiu: true },
    orderBy: [{ destacat: 'desc' }, { ordre: 'asc' }, { nom: 'asc' }],
  });

  // Agrupa per categoria respectant l'ordre fix.
  const grups = CATEGORIES_EQUIP.map((categoria) => ({
    categoria,
    meta: categoriaMeta[categoria],
    items: equips.filter((e) => e.categoria === categoria),
  })).filter((g) => g.items.length > 0);

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

      {grups.length === 0 ? (
        <section className="container-page py-12">
          <p className="text-center text-text-gray">
            Aviat publicarem aquí el nostre catàleg d’equips. Mentrestant,
            demana’ns pressupost i t’ho expliquem tot.
          </p>
        </section>
      ) : (
        <div className="container-page space-y-16 py-12">
          {grups.map((grup) => {
            const Icon = grup.meta?.Icon ?? IconSpeaker;
            return (
              <section key={grup.categoria}>
                <Reveal className="mb-6 flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-electric/30 bg-electric/10 text-electric-bright">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-platinum">
                      {grup.categoria}
                    </h2>
                    {grup.meta?.text && (
                      <p className="mt-1 max-w-2xl text-sm text-text-gray">
                        {grup.meta.text}
                      </p>
                    )}
                  </div>
                </Reveal>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {grup.items.map((equip, i) => (
                    <Reveal key={equip.id} delay={(i % 3) * 0.08}>
                      <div className="panel group h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-electric/40 hover:shadow-glow-soft">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <GradientImage
                            alt={equip.nom}
                            src={equip.fotos[0]}
                            from="#0A2A66"
                            to="#0C1122"
                            className="transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-5">
                          <h3 className="font-display text-lg font-bold text-platinum">
                            {equip.nom}
                          </h3>
                          {equip.descripcio && (
                            <p className="mt-2 text-sm leading-relaxed text-text-gray">
                              {equip.descripcio}
                            </p>
                          )}
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <CtaBand
        title="Necessites equip per a la teva festa?"
        text="Digues-nos què necessites i et passem un pressupost de lloguer a mida."
        href={CTA_HREF}
      />
    </>
  );
}
