import type { Metadata } from 'next';
import { PagePlaceholder } from '@/components/sections/PagePlaceholder';

export function generateMetadata(): Metadata {
  return {
    title: 'Festes majors',
    description:
      'Espectacle i potència per a festes majors: artistes, so i il·luminació per omplir places i envelats a Catalunya.',
    alternates: { canonical: '/festes-majors' },
  };
}

export default function FestesMajorsPage() {
  return (
    <PagePlaceholder
      eyebrow="Festes majors"
      title="Fem vibrar la teva festa major"
      description="Aviat trobaràs aquí propostes d’artistes i producció per a festes majors."
    />
  );
}
