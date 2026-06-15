import type { Metadata } from 'next';
import { PagePlaceholder } from '@/components/sections/PagePlaceholder';

export function generateMetadata(): Metadata {
  return {
    title: 'Lloguer d’equips',
    description:
      'Lloguer d’equips de so i il·luminació professional per a esdeveniments petits i mitjans a Catalunya.',
    alternates: { canonical: '/lloguer-equips' },
  };
}

export default function LloguerEquipsPage() {
  return (
    <PagePlaceholder
      eyebrow="Lloguer d’equips"
      title="So i il·luminació professional"
      description="Aviat trobaràs aquí el nostre catàleg d’equips de so, llums i escenaris per llogar."
    />
  );
}
