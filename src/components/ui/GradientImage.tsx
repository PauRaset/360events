import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * Placeholder visual amb next/image fins que tinguem fotografies reals.
 * Genera un degradat com a data-URI SVG perquè es comporti com una imatge.
 */
function gradientDataUri(from: string, to: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${from}"/><stop offset="100%" stop-color="${to}"/></linearGradient></defs><rect width="800" height="1000" fill="url(#g)"/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function GradientImage({
  alt,
  src,
  from = '#0A2A66',
  to = '#05070F',
  className,
  sizes = '(max-width: 768px) 100vw, 33vw',
}: {
  alt: string;
  /** Imatge real opcional; si no es passa, es mostra el degradat placeholder. */
  src?: string;
  from?: string;
  to?: string;
  className?: string;
  sizes?: string;
}) {
  const source = src && src.length > 0 ? src : gradientDataUri(from, to);
  return (
    <Image
      src={source}
      alt={alt}
      fill
      sizes={sizes}
      unoptimized
      className={cn('object-cover', className)}
    />
  );
}
