'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export type EquipRow = {
  id: string;
  nom: string;
  categoria: string;
  foto: string | null;
  actiu: boolean;
  destacat: boolean;
};

export function EquipsAdminList({ initial }: { initial: EquipRow[] }) {
  const [rows, setRows] = useState(initial);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function remove(id: string, nom: string) {
    if (!confirm(`Segur que vols eliminar “${nom}”? Aquesta acció no es pot desfer.`)) {
      return;
    }
    setError(null);
    setDeleting(id);
    try {
      const res = await fetch(`/api/equips/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setRows((rs) => rs.filter((r) => r.id !== id));
    } catch {
      setError('No s’ha pogut eliminar l’equip. Torna-ho a provar.');
    } finally {
      setDeleting(null);
    }
  }

  if (rows.length === 0) {
    return (
      <p className="mt-10 text-center text-text-gray">
        Encara no hi ha equips. Comença afegint-ne un.
      </p>
    );
  }

  return (
    <div>
      {error && (
        <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}
      <div className="grid gap-3">
        {rows.map((r) => (
          <div
            key={r.id}
            className="flex items-center gap-4 rounded-2xl border border-white/10 bg-panel/70 p-4"
          >
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-base">
              {r.foto ? (
                <Image
                  src={r.foto}
                  alt={r.nom}
                  fill
                  sizes="56px"
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-text-gray">
                  Sense foto
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate font-display font-bold text-platinum">
                  {r.nom}
                </h2>
                {r.destacat && (
                  <span className="rounded-full border border-electric/40 bg-electric/10 px-2 py-0.5 text-xs text-electric-bright">
                    Destacat
                  </span>
                )}
                <span
                  className={`rounded-full border px-2 py-0.5 text-xs ${
                    r.actiu
                      ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300'
                      : 'border-white/15 bg-white/5 text-text-gray'
                  }`}
                >
                  {r.actiu ? 'Actiu' : 'Inactiu'}
                </span>
              </div>
              <p className="truncate text-sm text-text-gray">{r.categoria}</p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Link
                href={`/panell/equips/${r.id}/editar`}
                className="btn-ghost px-4 py-2 text-sm"
              >
                Editar
              </Link>
              <button
                type="button"
                onClick={() => remove(r.id, r.nom)}
                disabled={deleting === r.id}
                className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/20 disabled:opacity-60"
              >
                {deleting === r.id ? 'Eliminant…' : 'Eliminar'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
