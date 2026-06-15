import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { GradientImage } from '@/components/ui/GradientImage';
import { ReservaForm } from '@/components/ReservaForm';
import { IconArrowRight, IconSpeaker } from '@/components/ui/Icons';
import { site } from '@/lib/site';

export const dynamic = 'force-dynamic';

async function getArtista(slug: string) {
  return prisma.artista.findUnique({ where: { slug } });
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const artista = await getArtista(params.slug);
  if (!artista) {
    return { title: 'Artista no trobat' };
  }
  const description = artista.descripcio.slice(0, 155);
  return {
    title: artista.nom,
    description,
    alternates: { canonical: `/artistes/${artista.slug}` },
    openGraph: {
      title: `${artista.nom} · ${artista.categoria}`,
      description,
      type: 'profile',
    },
  };
}

export default async function ArtistaPage({
  params,
}: {
  params: { slug: string };
}) {
  const artista = await getArtista(params.slug);
  if (!artista) notFound();

  const esVeu = artista.categoria.toLowerCase().includes('veu');
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': esVeu ? 'Person' : 'MusicGroup',
    name: artista.nom,
    description: artista.descripcio,
    url: `${site.url}/artistes/${artista.slug}`,
    genre: artista.categoria,
  };

  // Si no hi ha fotos reals, mostrem 3 placeholders de degradat.
  const fotos = artista.fotos.length > 0 ? artista.fotos : [null, null, null];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Capçalera */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-glow" />
        <div className="container-page relative pb-12 pt-36">
          <p className="text-sm font-semibold uppercase tracking-widest text-electric-bright">
            {artista.categoria}
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold sm:text-6xl">
            {artista.nom}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-gray">
            {artista.descripcio}
          </p>

          {/* 3 accions → obren el formulari de reserva */}
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href="#reserva" className="btn-primary">
              Sol·licitar pressupost
              <IconArrowRight className="h-4 w-4" />
            </a>
            <a href="#reserva" className="btn-ghost">
              Consultar disponibilitat
            </a>
            <a href="#reserva" className="btn-ghost">
              Reservar
            </a>
          </div>
        </div>
      </section>

      {/* Galeria de fotos */}
      <section className="container-page py-12">
        <h2 className="mb-6 font-display text-2xl font-bold text-platinum">
          Galeria
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {fotos.map((foto, i) => (
            <div
              key={i}
              className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10"
            >
              <GradientImage
                alt={`${artista.nom} — imatge ${i + 1}`}
                src={foto ?? undefined}
                from={i % 2 === 0 ? '#0A2A66' : '#080B16'}
                to={i % 2 === 0 ? '#1E7BFF' : '#3D93FF'}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Vídeos */}
      <section className="container-page py-12">
        <h2 className="mb-6 font-display text-2xl font-bold text-platinum">
          Vídeos
        </h2>
        {artista.videos.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {artista.videos.map((url, i) => (
              <div
                key={i}
                className="relative aspect-video overflow-hidden rounded-2xl border border-white/10"
              >
                <iframe
                  src={url}
                  title={`${artista.nom} — vídeo ${i + 1}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="panel p-6 text-text-gray">
            Aviat afegirem vídeos d’actuacions de {artista.nom}.
          </p>
        )}
      </section>

      {/* Rider tècnic */}
      {artista.riderTecnic ? (
        <section className="container-page py-12">
          <div className="panel p-7">
            <h2 className="flex items-center gap-3 font-display text-2xl font-bold text-platinum">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-electric/30 bg-electric/10 text-electric-bright">
                <IconSpeaker className="h-5 w-5" />
              </span>
              Rider tècnic
            </h2>
            <p className="mt-4 leading-relaxed text-text-gray">
              {artista.riderTecnic}
            </p>
          </div>
        </section>
      ) : null}

      {/* Formulari de reserva */}
      <section id="reserva" className="container-page scroll-mt-24 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-electric-bright">
              Reserva
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
              Sol·licita {artista.nom} per al teu esdeveniment
            </h2>
            <p className="mt-4 text-text-gray">
              Omple el formulari i et farem un pressupost a mida, sense
              compromís.
            </p>
          </div>
          <ReservaForm artistaId={artista.id} artistaNom={artista.nom} />
        </div>
      </section>
    </>
  );
}
