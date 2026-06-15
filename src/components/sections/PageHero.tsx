import type { ReactNode } from 'react';

/**
 * Capçalera reutilitzable per a les pàgines internes.
 * Manté l'estètica de la home: eyebrow, títol gran i subtítol.
 */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="container-page relative pb-12 pt-36 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-electric-bright">
          {eyebrow}
        </p>
        <h1 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-extrabold leading-[1.08] sm:text-6xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mx-auto mt-6 max-w-2xl text-lg text-text-gray">
            {subtitle}
          </p>
        ) : null}
        {children ? (
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
}
