'use client';

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { IconPhone } from '@/components/ui/Icons';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function CallbackBand() {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (phone.trim().length < 6) {
      setError('Introdueix un telèfon vàlid');
      setStatus('error');
      return;
    }
    setError(null);
    setStatus('loading');
    try {
      const res = await fetch('/api/truca', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telefon: phone }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? 'No s’ha pogut enviar');
      }
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hi ha hagut un problema');
      setStatus('error');
    }
  }

  return (
    <section id="truquem" className="relative py-20">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border-2 border-electric/40 bg-gradient-to-br from-electric-deep/60 via-panel to-base p-8 shadow-glow-lg sm:p-12"
        >
          {/* Efectes de llum */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 animate-float rounded-full bg-electric/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-electric-bright/15 blur-3xl" />

          <div className="relative grid items-center gap-8 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-electric/40 bg-electric/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-electric-bright">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric-bright opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-electric-bright" />
                </span>
                Resposta ràpida
              </span>
              <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">
                Vols que et truquem <span className="heading-gradient">ara</span>?
              </h2>
              <p className="mt-3 max-w-md text-text-gray">
                Deixa’ns el teu telèfon i et truquem nosaltres per preparar el teu
                esdeveniment, sense compromís. Tu no pagues la trucada.
              </p>
            </div>

            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                role="status"
                className="flex items-center gap-4 rounded-2xl border border-electric/40 bg-electric/10 p-6 text-platinum"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-electric/20 text-electric-bright">
                  <IconPhone className="h-6 w-6" />
                </span>
                <p className="text-sm">
                  Rebut! Et trucarem ben aviat al{' '}
                  <strong className="text-white">{phone}</strong>. 🎉
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <label htmlFor="callback-phone" className="sr-only">
                    El teu telèfon
                  </label>
                  <div className="relative flex-1">
                    <IconPhone className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-gray" />
                    <input
                      id="callback-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="El teu telèfon"
                      className="w-full rounded-full border border-white/15 bg-base/60 py-4 pl-12 pr-4 text-platinum placeholder:text-text-gray focus:border-electric focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-primary shrink-0 px-7 py-4 text-base disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === 'loading' ? 'Enviant…' : 'Truqueu-me ara'}
                  </button>
                </div>
                {status === 'error' && error && (
                  <p className="text-sm text-red-300">{error}</p>
                )}
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
