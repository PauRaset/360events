import type { Metadata } from 'next';
import { PagePlaceholder } from '@/components/sections/PagePlaceholder';

export function generateMetadata(): Metadata {
  return {
    title: 'Qui som',
    description:
      'Coneix l’equip de 360Events: artistes, producció i lloguer d’equips per a esdeveniments a Catalunya.',
    alternates: { canonical: '/qui-som' },
  };
}

export default function QuiSomPage() {
  return (
    <PagePlaceholder
      eyebrow="Qui som"
      title="Apassionats per crear experiències 360°"
      description="Un equip català dedicat a la música, l’espectacle i la producció d’esdeveniments inoblidables."
    />
  );
}
