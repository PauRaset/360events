'use client';

import { useMemo, useState } from 'react';
import {
  ESTAT_RESERVA,
  ESTAT_LABELS,
  type EstatReservaValue,
} from '@/lib/schemas';

export type ReservaItem = {
  id: string;
  nom: string;
  telefon: string;
  email: string;
  tipusEvent: string;
  dataEvent: string;
  ubicacio: string;
  assistents: number | null;
  missatge: string | null;
  servei: string | null;
  artistaNom: string | null;
  estat: EstatReservaValue;
  createdAt: string;
};

type Filter = EstatReservaValue | 'TOTES';

/** Colors d'accent per estat. */
const estatColor: Record<EstatReservaValue, string> = {
  NOVA: 'border-electric/50 bg-electric/10 text-electric-bright',
  EN_REVISIO: 'border-amber-400/40 bg-amber-400/10 text-amber-300',
  PRESSUPOST_ENVIAT: 'border-sky-400/40 bg-sky-400/10 text-sky-300',
  CONFIRMADA: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300',
  CANCELLADA: 'border-red-400/40 bg-red-400/10 text-red-300',
};

function formatData(iso: string) {
  return new Date(iso).toLocaleDateString('ca-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function ReservesBoard({ initial }: { initial: ReservaItem[] }) {
  const [reserves, setReserves] = useState(initial);
  const [filter, setFilter] = useState<Filter>('TOTES');
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = {
      TOTES: reserves.length,
      NOVA: 0,
      EN_REVISIO: 0,
      PRESSUPOST_ENVIAT: 0,
      CONFIRMADA: 0,
      CANCELLADA: 0,
    };
    for (const r of reserves) c[r.estat] += 1;
    return c;
  }, [reserves]);

  const visibles =
    filter === 'TOTES'
      ? reserves
      : reserves.filter((r) => r.estat === filter);

  async function canviarEstat(id: string, estat: EstatReservaValue) {
    const previ = reserves.find((r) => r.id === id)?.estat;
    setError(null);
    setUpdating(id);
    // Actualització optimista
    setReserves((rs) => rs.map((r) => (r.id === id ? { ...r, estat } : r)));
    try {
      const res = await fetch(`/api/reserves/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estat }),
      });
      if (!res.ok) throw new Error();
    } catch {
      // Revertim si falla
      if (previ) {
        setReserves((rs) =>
          rs.map((r) => (r.id === id ? { ...r, estat: previ } : r)),
        );
      }
      setError('No s’ha pogut actualitzar l’estat. Torna-ho a provar.');
    } finally {
      setUpdating(null);
    }
  }

  const filtres: Filter[] = ['TOTES', ...ESTAT_RESERVA];

  return (
    <div>
      {/* Filtres */}
      <div className="flex flex-wrap gap-2">
        {filtres.map((f) => {
          const active = filter === f;
          const label = f === 'TOTES' ? 'Totes' : ESTAT_LABELS[f];
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'border-electric bg-electric/15 text-platinum'
                  : 'border-white/10 bg-white/5 text-text-gray hover:text-platinum'
              }`}
            >
              {label}
              <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-xs text-silver">
                {counts[f]}
              </span>
            </button>
          );
        })}
      </div>

      {error && (
        <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      {/* Llista */}
      {visibles.length === 0 ? (
        <p className="mt-10 text-center text-text-gray">
          No hi ha reserves en aquest estat.
        </p>
      ) : (
        <div className="mt-6 grid gap-4">
          {visibles.map((r) => (
            <article
              key={r.id}
              className="rounded-2xl border border-white/10 bg-panel/70 p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-display text-lg font-bold text-platinum">
                      {r.nom}
                    </h2>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${estatColor[r.estat]}`}
                    >
                      {ESTAT_LABELS[r.estat]}
                    </span>
                  </div>

                  <dl className="mt-3 grid grid-cols-1 gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
                    <Field label="Telèfon">
                      <a
                        href={`tel:${r.telefon}`}
                        className="text-silver hover:text-platinum"
                      >
                        {r.telefon}
                      </a>
                    </Field>
                    <Field label="Correu">
                      <a
                        href={`mailto:${r.email}`}
                        className="text-silver hover:text-platinum"
                      >
                        {r.email}
                      </a>
                    </Field>
                    <Field label="Tipus">{r.tipusEvent}</Field>
                    <Field label="Data">{formatData(r.dataEvent)}</Field>
                    <Field label="Ubicació">{r.ubicacio}</Field>
                    <Field label="Assistents">
                      {r.assistents ?? '—'}
                    </Field>
                    <Field label="Artista / servei">
                      {r.artistaNom ?? r.servei ?? '—'}
                    </Field>
                    <Field label="Rebuda">{formatData(r.createdAt)}</Field>
                  </dl>

                  {r.missatge && (
                    <p className="mt-3 rounded-xl border border-white/10 bg-base/50 p-3 text-sm text-text-gray">
                      {r.missatge}
                    </p>
                  )}
                </div>

                {/* Selector d'estat */}
                <div className="shrink-0">
                  <label
                    htmlFor={`estat-${r.id}`}
                    className="mb-1.5 block text-xs uppercase tracking-wide text-text-gray"
                  >
                    Canviar estat
                  </label>
                  <select
                    id={`estat-${r.id}`}
                    value={r.estat}
                    disabled={updating === r.id}
                    onChange={(e) =>
                      canviarEstat(r.id, e.target.value as EstatReservaValue)
                    }
                    className="rounded-xl border border-white/15 bg-base/60 px-4 py-2.5 text-sm text-platinum focus:border-electric focus:outline-none disabled:opacity-60"
                  >
                    {ESTAT_RESERVA.map((estat) => (
                      <option key={estat} value={estat}>
                        {ESTAT_LABELS[estat]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-2">
      <dt className="text-text-gray">{label}:</dt>
      <dd className="min-w-0 truncate font-medium text-silver">{children}</dd>
    </div>
  );
}
