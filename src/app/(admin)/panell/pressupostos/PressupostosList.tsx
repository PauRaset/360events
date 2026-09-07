'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatEuros, formatData, ESTAT_PRESSUPOST_LABELS } from '@/lib/format';

export type PressupostRow = {
  id: string;
  codi: string;
  token: string;
  estat: string;
  clientNom: string;
  dataEvent: string;
  importCentims: number;
  artistaNom: string | null;
};

const estatColor: Record<string, string> = {
  ESBORRANY: 'border-white/15 bg-white/5 text-text-gray',
  ENVIAT: 'border-sky-400/40 bg-sky-400/10 text-sky-300',
  SIGNAT: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300',
  REBUTJAT: 'border-red-400/40 bg-red-400/10 text-red-300',
  CANCELLAT: 'border-white/15 bg-white/5 text-text-gray',
};

export function PressupostosList({ initial }: { initial: PressupostRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function enviar(id: string) {
    setBusy(id);
    setMsg(null);
    try {
      const res = await fetch(`/api/pressupostos/${id}/enviar`, { method: 'POST' });
      if (!res.ok) throw new Error();
      setRows((rs) => rs.map((r) => (r.id === id ? { ...r, estat: 'ENVIAT' } : r)));
      setMsg('Pressupost enviat al client per correu.');
      router.refresh();
    } catch {
      setMsg('No s’ha pogut enviar.');
    } finally {
      setBusy(null);
    }
  }

  async function eliminar(id: string) {
    if (!confirm('Eliminar aquest pressupost?')) return;
    setBusy(id);
    try {
      const res = await fetch(`/api/pressupostos/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setRows((rs) => rs.filter((r) => r.id !== id));
    } catch {
      setMsg('No s’ha pogut eliminar.');
    } finally {
      setBusy(null);
    }
  }

  function copiarEnllac(token: string) {
    const link = `${window.location.origin}/pressupost/${token}`;
    navigator.clipboard?.writeText(link).then(
      () => setMsg('Enllaç copiat al porta-retalls.'),
      () => setMsg(link),
    );
  }

  if (rows.length === 0) {
    return <p className="mt-10 text-center text-text-gray">Encara no hi ha pressupostos.</p>;
  }

  return (
    <div>
      {msg && (
        <p className="mb-4 rounded-xl border border-electric/30 bg-electric/10 px-4 py-3 text-sm text-platinum">
          {msg}
        </p>
      )}
      <div className="grid gap-3">
        {rows.map((r) => (
          <div key={r.id} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-panel/70 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-text-gray">{r.codi}</span>
                <span className={`rounded-full border px-2 py-0.5 text-xs ${estatColor[r.estat] ?? ''}`}>
                  {ESTAT_PRESSUPOST_LABELS[r.estat] ?? r.estat}
                </span>
              </div>
              <h2 className="mt-1 font-display font-bold text-platinum">{r.clientNom}</h2>
              <p className="text-sm text-text-gray">
                {formatData(r.dataEvent)} · {formatEuros(r.importCentims)}
                {r.artistaNom ? ` · ${r.artistaNom}` : ''}
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {r.estat === 'ESBORRANY' && (
                <>
                  <Link href={`/panell/pressupostos/${r.id}/editar`} className="btn-ghost px-4 py-2 text-sm">Editar</Link>
                  <button type="button" onClick={() => enviar(r.id)} disabled={busy === r.id} className="btn-primary px-4 py-2 text-sm disabled:opacity-60">
                    {busy === r.id ? 'Enviant…' : 'Enviar'}
                  </button>
                </>
              )}
              {(r.estat === 'ENVIAT' || r.estat === 'SIGNAT') && (
                <>
                  <button type="button" onClick={() => copiarEnllac(r.token)} className="btn-ghost px-4 py-2 text-sm">Copiar enllaç</button>
                  <a href={`/api/pressupost/${r.token}/pdf`} target="_blank" rel="noopener noreferrer" className="btn-ghost px-4 py-2 text-sm">PDF</a>
                </>
              )}
              {r.estat !== 'SIGNAT' && (
                <button type="button" onClick={() => eliminar(r.id)} disabled={busy === r.id} className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/20 disabled:opacity-60">
                  Eliminar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
