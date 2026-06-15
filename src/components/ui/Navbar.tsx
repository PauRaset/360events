'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Logo } from './Logo';
import { Button } from './Button';
import { IconMenu, IconClose, IconPhone } from './Icons';
import { navLinks, site } from '@/lib/site';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Bloqueja l'scroll quan el menú mòbil és obert
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-white/10 bg-base/70 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <nav className="container-page flex h-16 items-center justify-between md:h-20">
        <Logo />

        {/* Enllaços escriptori */}
        <ul className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-silver transition-colors hover:text-platinum"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTAs escriptori */}
        <div className="hidden items-center gap-3 md:flex">
          <Button href="/contacte" variant="ghost" className="px-4 py-2.5">
            <IconPhone className="h-4 w-4" />
            Vols que et truquem?
          </Button>
          <Button href="/contacte" className="px-5 py-2.5">
            Pressupost
          </Button>
        </div>

        {/* Botó hamburguesa */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Tancar menú' : 'Obrir menú'}
          aria-expanded={open}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-platinum md:hidden"
        >
          {open ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Menú mòbil */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden"
          >
            <div className="container-page border-t border-white/10 bg-base/95 pb-8 pt-4 backdrop-blur-xl">
              <ul className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-4 py-3 text-base font-medium text-silver transition-colors hover:bg-white/5 hover:text-platinum"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-col gap-3">
                <Button
                  href="/contacte"
                  variant="ghost"
                  onClick={() => setOpen(false)}
                >
                  <IconPhone className="h-4 w-4" />
                  Vols que et truquem?
                </Button>
                <Button href="/contacte" onClick={() => setOpen(false)}>
                  Demana pressupost
                </Button>
                <a
                  href={site.contact.phoneHref}
                  className="pt-2 text-center text-sm text-text-gray"
                >
                  {site.contact.phone}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
