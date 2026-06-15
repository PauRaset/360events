'use client';

import { useState, type FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { IconArrowRight } from '@/components/ui/Icons';

const inputCls =
  'w-full rounded-xl border border-white/15 bg-base/60 px-4 py-3 text-platinum placeholder:text-text-gray transition-colors focus:border-electric focus:outline-none';
const labelCls = 'mb-1.5 block text-sm font-medium text-silver';

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await signIn('credentials', {
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
      redirect: false,
    });

    setLoading(false);
    if (res?.error) {
      setError('Credencials incorrectes. Torna-ho a provar.');
      return;
    }
    router.push('/panell/reserves');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="panel p-6 sm:p-8">
      <div className="space-y-5">
        <div>
          <label htmlFor="email" className={labelCls}>
            Correu electrònic
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            className={inputCls}
            placeholder="info@360events.cat"
          />
        </div>
        <div>
          <label htmlFor="password" className={labelCls}>
            Contrasenya
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className={inputCls}
            placeholder="••••••••"
          />
        </div>
      </div>

      {error && (
        <p className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary mt-7 w-full disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Entrant…' : 'Entrar'}
        {!loading && <IconArrowRight className="h-4 w-4" />}
      </button>
    </form>
  );
}
