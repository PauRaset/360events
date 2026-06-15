'use client';

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { reservaSchema, TIPUS_EVENT } from '@/lib/schemas';
import { IconArrowRight } from '@/components/ui/Icons';

type Status = 'idle' | 'loading' | 'success' | 'error';

const inputCls =
  'w-full rounded-xl border border-white/15 bg-base/60 px-4 py-3 text-platinum placeholder:text-text-gray transition-colors focus:border-electric focus:outline-none';
const labelCls = 'mb-1.5 block text-sm font-medium text-silver';
const errorCls = 'mt-1 text-xs text-red-400';

export function ReservaForm({
  artistaId,
  artistaNom,
  servei,
}: {
  artistaId?: string;
  artistaNom?: string;
  servei?: string;
}) {
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldErrors({});
    setServerError(null);

    const formData = new FormData(e.currentTarget);
    const raw = Object.fromEntries(formData.entries());

    // Validació al client
    const parsed = reservaSchema.safeParse(raw);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === 'string' && !errs[key]) errs[key] = issue.message;
      }
      setFieldErrors(errs);
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/reserves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? 'Error desconegut');
      }
      setStatus('success');
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Hi ha hagut un problema',
      );
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="panel flex flex-col items-center gap-4 p-10 text-center"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-electric/40 bg-electric/10 text-electric-bright">
          <IconArrowRight className="h-7 w-7" />
        </span>
        <h3 className="font-display text-2xl font-bold text-platinum">
          Sol·licitud rebuda!
        </h3>
        <p className="max-w-md text-text-gray">
          Hem rebut la teva sol·licitud, et contactarem aviat per donar forma al
          teu esdeveniment. Gràcies per confiar en 360Events! 🎉
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="panel p-6 sm:p-8">
      {artistaId ? (
        <input type="hidden" name="artistaId" value={artistaId} />
      ) : null}
      {servei ? <input type="hidden" name="servei" value={servei} /> : null}

      {artistaNom ? (
        <p className="mb-6 rounded-xl border border-electric/20 bg-electric/10 px-4 py-3 text-sm text-platinum">
          Sol·licitud per a <strong>{artistaNom}</strong>
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="nom" className={labelCls}>
            Nom i cognoms
          </label>
          <input id="nom" name="nom" className={inputCls} placeholder="El teu nom" />
          {fieldErrors.nom && <p className={errorCls}>{fieldErrors.nom}</p>}
        </div>

        <div>
          <label htmlFor="telefon" className={labelCls}>
            Telèfon
          </label>
          <input
            id="telefon"
            name="telefon"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            className={inputCls}
            placeholder="600 000 000"
          />
          {fieldErrors.telefon && (
            <p className={errorCls}>{fieldErrors.telefon}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className={labelCls}>
            Correu electrònic
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className={inputCls}
            placeholder="hola@exemple.cat"
          />
          {fieldErrors.email && <p className={errorCls}>{fieldErrors.email}</p>}
        </div>

        <div>
          <label htmlFor="tipusEvent" className={labelCls}>
            Tipus d’esdeveniment
          </label>
          <select
            id="tipusEvent"
            name="tipusEvent"
            defaultValue=""
            className={inputCls}
          >
            <option value="" disabled>
              Tria una opció
            </option>
            {TIPUS_EVENT.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {fieldErrors.tipusEvent && (
            <p className={errorCls}>{fieldErrors.tipusEvent}</p>
          )}
        </div>

        <div>
          <label htmlFor="dataEvent" className={labelCls}>
            Data de l’esdeveniment
          </label>
          <input
            id="dataEvent"
            name="dataEvent"
            type="date"
            className={inputCls}
          />
          {fieldErrors.dataEvent && (
            <p className={errorCls}>{fieldErrors.dataEvent}</p>
          )}
        </div>

        <div>
          <label htmlFor="ubicacio" className={labelCls}>
            Ubicació
          </label>
          <input
            id="ubicacio"
            name="ubicacio"
            className={inputCls}
            placeholder="Població o espai"
          />
          {fieldErrors.ubicacio && (
            <p className={errorCls}>{fieldErrors.ubicacio}</p>
          )}
        </div>

        <div>
          <label htmlFor="assistents" className={labelCls}>
            Nombre aproximat d’assistents
          </label>
          <input
            id="assistents"
            name="assistents"
            type="number"
            min={1}
            className={inputCls}
            placeholder="Ex: 120"
          />
          {fieldErrors.assistents && (
            <p className={errorCls}>{fieldErrors.assistents}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="missatge" className={labelCls}>
            Missatge o necessitats especials
          </label>
          <textarea
            id="missatge"
            name="missatge"
            rows={4}
            className={inputCls}
            placeholder="Explica’ns com t’imagines el teu esdeveniment…"
          />
          {fieldErrors.missatge && (
            <p className={errorCls}>{fieldErrors.missatge}</p>
          )}
        </div>
      </div>

      {status === 'error' && serverError && (
        <p className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          Ups! No hem pogut enviar la sol·licitud ({serverError}). Torna-ho a
          provar o truca’ns directament.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-primary mt-7 w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === 'loading' ? 'Enviant…' : 'Enviar sol·licitud'}
        {status !== 'loading' && <IconArrowRight className="h-4 w-4" />}
      </button>
    </form>
  );
}
