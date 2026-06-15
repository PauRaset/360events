import type { Metadata } from 'next';
import { PagePlaceholder } from '@/components/sections/PagePlaceholder';

export function generateMetadata(): Metadata {
  return {
    title: 'Artistes',
    description:
      'Descobreix els DJs, grups i espectacles que pots contractar amb 360Events per al teu esdeveniment a Catalunya.',
    alternates: { canonical: '/artistes' },
  };
}

export default function ArtistesPage() {
  return (
    <PagePlaceholder
      eyebrow="Artistes"
      title="El millor talent per al teu esdeveniment"
      description="Aviat podràs explorar aquí tot el nostre catàleg d’artistes, DJs i espectacles."
    />
  );
}
