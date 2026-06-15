import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Panell d’administració',
};

/**
 * Placeholder del panell d'administració.
 * La lògica (auth, base de dades, gestió) arribarà en fases posteriors.
 */
export default function PanellPage() {
  return (
    <div className="container-page flex min-h-screen flex-col items-center justify-center py-24 text-center">
      <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-widest text-text-gray">
        En construcció
      </span>
      <h1 className="mt-6 font-display text-3xl font-extrabold text-platinum">
        Panell 360 Events
      </h1>
      <p className="mt-3 max-w-md text-sm text-text-gray">
        L’àrea d’administració (autenticació, base de dades, gestió d’artistes i
        esdeveniments) s’implementarà en properes fases.
      </p>
    </div>
  );
}
