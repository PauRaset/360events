'use client';

import { useMemo, useState } from 'react';

const MESOS = [
  'gener', 'febrer', 'març', 'abril', 'maig', 'juny',
  'juliol', 'agost', 'setembre', 'octubre', 'novembre', 'desembre',
];
const DIES = ['Dl', 'Dt', 'Dc', 'Dj', 'Dv', 'Ds', 'Dg'];

const pad = (n: number) => String(n).padStart(2, '0');
const ymd = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

function todayYmd() {
  const now = new Date();
  return ymd(now.getFullYear(), now.getMonth(), now.getDate());
}

/**
 * Calendari de disponibilitat. Els dies "bloquejats" es mostren com a ocupats.
 * En mode editable, clicar un dia el bloqueja/allibera (API /api/disponibilitat).
 */
export function AvailabilityCalendar({
  artistaId,
  initialBlocked,
  editable = false,
}: {
  artistaId: string;
  initialBlocked: string[];
  editable?: boolean;
}) {
  const [blocked, setBlocked] = useState<Set<string>>(
    () => new Set(initialBlocked),
  );
  const now = new Date();
  const [cursor, setCursor] = useState({
    y: now.getFullYear(),
    m: now.getMonth(),
  });
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const today = todayYmd();

  const cells = useMemo(() => {
    const first = new Date(Date.UTC(cursor.y, cursor.m, 1)).getUTCDay(); // 0=diu
    const offset = (first + 6) % 7; // setmana comença dilluns
    const days = new Date(Date.UTC(cursor.y, cursor.m + 1, 0)).getUTCDate();
    const arr: (number | null)[] = [];
    for (let i = 0; i < offset; i++) arr.push(null);
    for (let d = 1; d <= days; d++) arr.push(d);
    return arr;
  }, [cursor]);

  async function toggle(dateStr: string) {
    if (!editable || busy) return;
    setError(null);
    setBusy(dateStr);
    const isBlocked = blocked.has(dateStr);
    // Optimista
    setBlocked((prev) => {
      const next = new Set(prev);
      if (isBlocked) next.delete(dateStr);
      else next.add(dateStr);
      return next;
    });
    try {
      const res = await fetch('/api/disponibilitat', {
        method: isBlocked ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artistaId, data: dateStr }),
      });
      if (!res.ok) throw new Error();
    } catch {
      // Revertim
      setBlocked((prev) => {
        const next = new Set(prev);
        if (isBlocked) next.add(dateStr);
        else next.delete(dateStr);
        return next;
      });
      setError('No s’ha pogut actualitzar el dia. Torna-ho a provar.');
    } finally {
      setBusy(null);
    }
  }

  function move(delta: number) {
    setCursor((c) => {
      const m = c.m + delta;
      return { y: c.y + Math.floor(m / 12), m: ((m % 12) + 12) % 12 };
    });
  }

  return (
    <div className="panel p-5">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => move(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-platinum hover:border-electric/50"
          aria-label="Mes anterior"
        >
          ‹
        </button>
        <span className="font-display text-lg font-bold capitalize text-platinum">
          {MESOS[cursor.m]} {cursor.y}
        </span>
        <button
          type="button"
          onClick={() => move(1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-platinum hover:border-electric/50"
          aria-label="Mes següent"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {DIES.map((d) => (
          <div key={d} className="pb-1 text-xs font-medium text-text-gray">
            {d}
          </div>
        ))}
        {cells.map((d, i) => {
          if (d === null) return <div key={`e${i}`} />;
          const dateStr = ymd(cursor.y, cursor.m, d);
          const isBlocked = blocked.has(dateStr);
          const isPast = dateStr < today;
          const base =
            'flex h-10 items-center justify-center rounded-lg text-sm transition-colors';
          let cls: string;
          if (isBlocked) {
            cls = 'border border-red-400/40 bg-red-400/15 text-red-200';
          } else if (isPast) {
            cls = 'text-text-gray/40';
          } else {
            cls = 'border border-emerald-400/20 bg-emerald-400/5 text-silver';
          }
          const interactive = editable && !isPast;
          return (
            <button
              key={dateStr}
              type="button"
              disabled={!interactive || busy === dateStr}
              onClick={() => toggle(dateStr)}
              className={`${base} ${cls} ${
                interactive ? 'cursor-pointer hover:border-electric/60' : 'cursor-default'
              } ${busy === dateStr ? 'opacity-50' : ''}`}
              title={isBlocked ? 'Ocupat' : 'Disponible'}
            >
              {d}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-text-gray">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded border border-emerald-400/30 bg-emerald-400/10" />
          Disponible
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded border border-red-400/40 bg-red-400/20" />
          Ocupat
        </span>
        {editable && <span>Clica un dia per marcar-lo o alliberar-lo.</span>}
      </div>

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}
