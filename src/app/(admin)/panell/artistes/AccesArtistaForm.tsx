'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

const inputCls =
  'w-full rounded-xl border border-white/15 bg-base/60 px-4 py-3 text-platinum placeholder:text-text-gray transition-colors focus:border-electric focus:outline-none';
const labelCls = 'mb-1.5 block text-sm font-medium text-silver';

export function AccesArtistaForm({
  artistaId,
  currentEmail,
}: {
  artistaId: string;
  currentEmail: string | null;
}) {
  const router = useRouter();
  const [email, setEmail] = useState(currentEmail ?? '');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'ok' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setStatus('saving');
    try {
      const res = await fetch(`/api/artistes/${artistaId}/acces`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => null);
        throw new Error(b?.error ?? 'Error');
      }
      setPassword('');
      setStatus('ok');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
      setStatus('error');
    }
  }

  async function remove() {
    if (!confirm('Eliminar l’accés d’aquest artista? No podrà iniciar sessió.')) return;
    setError(null);
    setStatus('saving');
    try {
      const res = await fetch(`/api/artistes/${artistaId}/acces`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setEmail('');
      setPassword('');
      setStatus('idle');
      router.refresh();
    } catch {
      setError('No s’ha pogut eliminar l’accés.');
      setStatus('error');
    }
  }

  return (
    <div className="panel p-6 sm:p-8">
      <h2 className="font-display text-lg font-bold text-platinum">
        Accés de l’artista
      </h2>
      <p className="mt-1 text-sm text-text-gray">
        {currentEmail
          ? 'Aquest artista ja té accés. Pots canviar el correu o la contrasenya.'
          : 'Crea un compte perquè l’artista pugui gestionar la seva agenda.'}
      </p>

      <form onSubmit={save} className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="acces-email" className={labelCls}>
            Correu d’accés
          </label>
          <input
            id="acces-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls}
            placeholder="artista@exemple.cat"
            required
          />
        </div>
        <div>
          <label htmlFor="acces-password" className={labelCls}>
            {currentEmail ? 'Nova contrasenya' : 'Contrasenya'}
          </label>
          <input
            id="acces-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputCls}
            placeholder="Mínim 8 caràcters"
            required
            minLength={8}
          />
        </div>

        <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={status === 'saving'}
            className="btn-primary disabled:opacity-60"
          >
            {status === 'saving' ? 'Desant…' : currentEmail ? 'Actualitzar accés' : 'Crear accés'}
          </button>
          {currentEmail && (
            <button type="button" onClick={remove} className="btn-ghost">
              Eliminar accés
            </button>
          )}
          {status === 'ok' && (
            <span className="text-sm text-emerald-300">Accés desat ✓</span>
          )}
          {status === 'error' && error && (
            <span className="text-sm text-red-400">{error}</span>
          )}
        </div>
      </form>
    </div>
  );
}
