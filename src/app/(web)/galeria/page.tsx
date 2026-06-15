import type { Metadata } from 'next';
import { PagePlaceholder } from '@/components/sections/PagePlaceholder';

export function generateMetadata(): Metadata {
  return {
    title: 'Galeria',
    description:
      'Imatges i vídeos dels esdeveniments produïts per 360Events arreu de Catalunya.',
    alternates: { canonical: '/galeria' },
  };
}

export default function GaleriaPage() {
  return (
    <PagePlaceholder
      eyebrow="Galeria"
      title="Moments que parlen per si sols"
      description="Aviat omplirem aquesta galeria amb fotografies i vídeos dels nostres esdeveniments."
    />
  );
}
