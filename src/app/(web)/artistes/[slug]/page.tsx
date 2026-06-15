import type { Metadata } from 'next';
import { PagePlaceholder } from '@/components/sections/PagePlaceholder';

/** Converteix un slug en un nom llegible per als placeholders. */
function slugToName(slug: string) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const name = slugToName(params.slug);
  return {
    title: name,
    description: `Perfil de ${name} — artista disponible per contractar amb 360Events a Catalunya.`,
    alternates: { canonical: `/artistes/${params.slug}` },
  };
}

export default function ArtistaPage({
  params,
}: {
  params: { slug: string };
}) {
  const name = slugToName(params.slug);
  return (
    <PagePlaceholder
      eyebrow="Artista"
      title={name}
      description="El perfil complet d’aquest artista (bio, vídeos i repertori) estarà disponible aviat."
    />
  );
}
