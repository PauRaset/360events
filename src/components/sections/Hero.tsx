'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { IconArrowRight } from '@/components/ui/Icons';

/* Barres de l'equalitzador (guiny al logo) */
const EQ_BARS = 28;

function Equalizer({ reduce }: { reduce: boolean }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 flex h-32 items-end justify-center gap-1.5 px-4 opacity-80 sm:gap-2"
    >
      {Array.from({ length: EQ_BARS }).map((_, i) => {
        const h = 20 + ((i * 37) % 70);
        return (
          <span
            key={i}
            className="w-1.5 rounded-t bg-gradient-to-t from-electric/10 via-electric to-electric-bright sm:w-2"
            style={{
              height: `${h}%`,
              animation: reduce
                ? undefined
                : `equalize ${0.8 + (i % 5) * 0.18}s ease-in-out ${(i % 7) * 0.12}s infinite`,
              transformOrigin: 'bottom',
            }}
          />
        );
      })}
    </div>
  );
}

/* Haces de llum d'escenari */
function LightBeams({ reduce }: { reduce: boolean }) {
  const beams = [
    { left: '15%', rotate: -18, delay: 0 },
    { left: '38%', rotate: -7, delay: 0.6 },
    { left: '60%', rotate: 8, delay: 1.1 },
    { left: '82%', rotate: 19, delay: 0.3 },
  ];
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {beams.map((b, i) => (
        <motion.div
          key={i}
          className="absolute top-[-20%] h-[140%] w-40 origin-top"
          style={{
            left: b.left,
            rotate: `${b.rotate}deg`,
            background:
              'linear-gradient(to bottom, rgba(61,147,255,0.22), rgba(30,123,255,0.05) 45%, transparent 75%)',
            filter: 'blur(18px)',
          }}
          initial={{ opacity: 0.25 }}
          animate={reduce ? undefined : { opacity: [0.2, 0.55, 0.2] }}
          transition={{
            duration: 4 + i,
            delay: b.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/* Partícules flotants */
function Particles({ reduce }: { reduce: boolean }) {
  const dots = Array.from({ length: 22 }).map((_, i) => ({
    left: `${(i * 47) % 100}%`,
    top: `${(i * 29) % 100}%`,
    size: 2 + (i % 3),
    delay: (i % 6) * 0.5,
    dur: 5 + (i % 5),
  }));
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {dots.map((d, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-electric-bright/60"
          style={{
            left: d.left,
            top: d.top,
            width: d.size,
            height: d.size,
            boxShadow: '0 0 8px rgba(61,147,255,0.8)',
          }}
          animate={
            reduce ? undefined : { y: [0, -22, 0], opacity: [0.2, 0.9, 0.2] }
          }
          transition={{
            duration: d.dur,
            delay: d.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export function Hero() {
  const reduce = useReducedMotion() ?? false;

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      {/* Capes de fons */}
      <div className="absolute inset-0 bg-gradient-to-b from-base-2 via-base to-base" />
      <div className="absolute inset-0 bg-grid-faint [background-size:64px_64px] opacity-40" />
      <LightBeams reduce={reduce} />
      <Particles reduce={reduce} />

      {/* Contingut */}
      <div className="container-page relative z-10 flex flex-col items-center pb-28 pt-28 text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-silver backdrop-blur"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-electric-bright" />
          Esdeveniments a Catalunya
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="max-w-4xl font-display text-4xl font-extrabold leading-[1.05] sm:text-6xl md:text-7xl"
        >
          Viu una{' '}
          <span className="heading-gradient">360° experiència</span> en cada
          esdeveniment
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-6 max-w-2xl text-base text-text-gray sm:text-lg"
        >
          Contractem artistes, produïm espectacles i lloguem equips de so i
          il·luminació perquè la teva festa, casament o esdeveniment d’empresa
          sigui inoblidable.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Button href="/contacte" className="w-full sm:w-auto">
            Demana pressupost gratuït
            <IconArrowRight className="h-4 w-4" />
          </Button>
          <Button href="/artistes" variant="ghost" className="w-full sm:w-auto">
            Veure artistes
          </Button>
        </motion.div>
      </div>

      <Equalizer reduce={reduce} />
    </section>
  );
}
