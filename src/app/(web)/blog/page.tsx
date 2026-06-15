import type { Metadata } from 'next';
import { PagePlaceholder } from '@/components/sections/PagePlaceholder';

export function generateMetadata(): Metadata {
  return {
    title: 'Blog',
    description:
      'Consells, tendències i novetats sobre música, espectacles i organització d’esdeveniments a Catalunya.',
    alternates: { canonical: '/blog' },
  };
}

export default function BlogPage() {
  return (
    <PagePlaceholder
      eyebrow="Blog"
      title="Idees i inspiració per als teus esdeveniments"
      description="Aviat publicarem aquí articles, consells i tendències del món de l’espectacle."
    />
  );
}
