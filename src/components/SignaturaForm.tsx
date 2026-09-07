'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { IconArrowRight } from '@/components/ui/Icons';

const inputCls =
  'w-full rounded-xl border border-white/15 bg-base/60 px-4 py-3 text-platinum placeholder:text-text-gray transition-colors focus:border-electric focus:outline-none';
const labelCls = 'mb-1.5 block text-sm font-medium text-silver';

export function SignaturaForm({ token }: { token: string }) {
  const router = useRouter();
  const [nom, setNom] = useState('');
  const [dni, setDni] = useState('');
  const [accepta, setAccepta] = useState(false);
  const [status, setStatus] = useState<'idle' | 'signing' | 'rejecting'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function signar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!accepta) {
      setError('Has d’acceptar les condicions per signar.');
      return;
    }
    setStatus('signing');
    try {
      const res = await fetch(`/api/pressupost/${token}/signar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, dni, accepta }),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => null);
        throw new Error(b?.error ?? 'No s’ha pogut signar');
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hi ha hagut un problema');
      setStatus('idle');
    }
  }

  async function rebutjar() {
    if (!confirm('Segur que vols rebutjar aquest pressupost?')) return;
    setError(null);
    setStatus('rejecting');
    try {
      const res = await fetch(`/api/pressupost/${token}/rebutjar`, { method: 'POST' });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setError('No s’ha pogut rebutjar.');
      setStatus('idle');
    }
  }

  return (
    <form onSubmit={signar} className="panel p-6 sm:p-8">
      <h2 className="font-display text-xl font-bold text-platinum">
        Acceptar i signar
      </h2>
      <p className="mt-1 text-sm text-text-gray">
        Signant, acceptes les condicions d’aquest pressupost i queda registrat com
        a contracte.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="sig-nom" className={labelCls}>Nom i cognoms</label>
          <input id="sig-nom" value={nom} onChange={(e) => setNom(e.target.value)} className={inputCls} required minLength={2} />
        </div>
        <div>
          <label htmlFor="sig-dni" className={labelCls}>DNI/NIF <span className="text-text-gray">(opcional)</span></label>
          <input id="sig-dni" value={dni} onChange={(e) => setDni(e.target.value)} className={inputCls} />
        </div>
      </div>

      <label className="mt-4 flex items-start gap-3 text-sm text-silver">
        <input type="checkbox" checked={accepta} onChange={(e) => setAccepta(e.target.checked)} className="mt-0.5 h-5 w-5 rounded border-white/20 bg-base/60 accent-electric" />
        He llegit i accepto les condicions d’aquest contracte de prestació de serveis.
      </label>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="submit" disabled={status !== 'idle'} className="btn-primary disabled:opacity-60">
          {status === 'signing' ? 'Signant…' : 'Acceptar i signar'}
          {status === 'idle' && <IconArrowRight className="h-4 w-4" />}
        </button>
        <button type="button" onClick={rebutjar} disabled={status !== 'idle'} className="btn-ghost">
          Rebutjar
        </button>
      </div>
    </form>
  );
}
