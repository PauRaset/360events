import Link from 'next/link';
import { GradientImage } from './GradientImage';
import { IconArrowRight } from './Icons';

/** Paleta de degradats per als placeholders, segons l'índex. */
const palettes = [
  { from: '#0A2A66', to: '#1E7BFF' },
  { from: '#080B16', to: '#3D93FF' },
  { from: '#0A2A66', to: '#0C1122' },
  { from: '#0C1122', to: '#3D93FF' },
];

export function ArtistCard({
  slug,
  nom,
  tag,
  index = 0,
  foto,
}: {
  slug: string;
  nom: string;
  tag: string;
  index?: number;
  foto?: string;
}) {
  const palette = palettes[index % palettes.length];

  return (
    <Link
      href={`/artistes/${slug}`}
      className="group relative block aspect-[4/5] overflow-hidden rounded-2xl border border-white/10"
    >
      <GradientImage
        alt={`Foto de ${nom}`}
        src={foto}
        from={palette.from}
        to={palette.to}
        className="transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-base via-base/30 to-transparent" />
      <div className="absolute inset-0 ring-0 ring-electric/0 transition-all duration-300 group-hover:shadow-glow-lg group-hover:ring-1 group-hover:ring-electric/40" />
      <div className="absolute bottom-0 left-0 w-full p-6">
        <p className="text-xs uppercase tracking-widest text-electric-bright">
          {tag}
        </p>
        <h3 className="mt-1 font-display text-xl font-bold text-white">{nom}</h3>
        <span className="mt-3 inline-flex translate-y-2 items-center gap-1.5 text-sm font-medium text-silver opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          Veure perfil <IconArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
