import type { Metadata } from 'next';
import { PagePlaceholder } from '@/components/sections/PagePlaceholder';

export function generateMetadata(): Metadata {
  return {
    title: 'Esdeveniments d’empresa',
    description:
      'Produïm festes, sopars i presentacions corporatives amb un acabat professional arreu de Catalunya.',
    alternates: { canonical: '/esdeveniments-empresa' },
  };
}

export default function EsdevenimentsEmpresaPage() {
  return (
    <PagePlaceholder
      eyebrow="Esdeveniments d’empresa"
      title="Experiències corporatives memorables"
      description="Aviat detallarem aquí les nostres solucions per a esdeveniments d’empresa."
    />
  );
}
