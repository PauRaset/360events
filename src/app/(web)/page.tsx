import type { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { QuiSom } from '@/components/sections/QuiSom';
import { Serveis } from '@/components/sections/Serveis';
import { ArtistesDestacats } from '@/components/sections/ArtistesDestacats';
import { TipusEsdeveniment } from '@/components/sections/TipusEsdeveniment';
import { CallbackBand } from '@/components/sections/CallbackBand';
import { localBusinessJsonLd } from '@/lib/jsonld';
import { site } from '@/lib/site';

export function generateMetadata(): Metadata {
  return {
    title: `${site.name} · ${site.tagline}`,
    description: site.description,
    alternates: { canonical: '/' },
  };
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // JSON-LD LocalBusiness per a cercadors
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessJsonLd()),
        }}
      />
      <Hero />
      <QuiSom />
      <Serveis />
      <ArtistesDestacats />
      <TipusEsdeveniment />
      <CallbackBand />
    </>
  );
}
