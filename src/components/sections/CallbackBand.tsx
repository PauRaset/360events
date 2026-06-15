'use client';

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { IconPhone } from '@/components/ui/Icons';

export function CallbackBand() {
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // UI preparada — la lògica de backend (Twilio) arribarà en fases posteriors.
    if (phone.trim().length < 6) return;
    setSent(true);
  }

  return (
    <section id="truquem" className="relative py-20">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-electric/20 bg-gradient-to-br from-electric-deep/40 via-panel to-base p-8 sm:p-12"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-electric/20 blur-3xl" />
          <div className="relative grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
                Vols que et truquem ara?
              </h2>
              <p className="mt-3 max-w-md text-text-gray">
                Deixa’ns el teu telèfon i un membre de l’equip et trucarà per
                preparar el teu esdeveniment sense compromís.
              </p>
            </div>

            {sent ? (
              <div
                role="status"
                className="flex items-center gap-3 rounded-2xl border border-electric/30 bg-electric/10 p-5 text-platinum"
              >
                <IconPhone className="h-6 w-6 text-electric-bright" />
                <p className="text-sm">
                  Rebut! Et trucarem ben aviat al{' '}
                  <strong className="text-white">{phone}</strong>.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3 sm:flex-row"
              >
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
                    className="w-full rounded-full border border-white/15 bg-base/60 py-3.5 pl-12 pr-4 text-platinum placeholder:text-text-gray focus:border-electric focus:outline-none"
                  />
                </div>
                <button type="submit" className="btn-primary shrink-0">
                  Truqueu-me
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
