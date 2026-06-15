import type { Metadata } from 'next';
import { PagePlaceholder } from '@/components/sections/PagePlaceholder';

export function generateMetadata(): Metadata {
  return {
    title: 'Casaments',
    description:
      'Música, espectacle i producció per al teu casament a Catalunya. De la cerimònia a la festa amb 360Events.',
    alternates: { canonical: '/casaments' },
  };
}

export default function CasamentsPage() {
  return (
    <PagePlaceholder
      eyebrow="Casaments"
      title="La banda sonora del vostre gran dia"
      description="Aviat compartirem aquí els nostres serveis i paquets pensats per a casaments."
    />
  );
}
