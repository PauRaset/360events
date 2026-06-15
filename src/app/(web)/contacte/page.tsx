import type { Metadata } from 'next';
import { CallbackBand } from '@/components/sections/CallbackBand';
import {
  IconPhone,
  IconInstagram,
  IconArrowRight,
} from '@/components/ui/Icons';
import { site } from '@/lib/site';

export function generateMetadata(): Metadata {
  return {
    title: 'Contacte',
    description:
      'Contacta amb 360Events per al teu pressupost gratuït. Telèfon, email i WhatsApp per a esdeveniments a Catalunya.',
    alternates: { canonical: '/contacte' },
  };
}

const cards = [
  {
    label: 'Truca’ns',
    value: site.contact.phone,
    href: site.contact.phoneHref,
    Icon: IconPhone,
  },
  {
    label: 'Escriu-nos',
    value: site.contact.email,
    href: `mailto:${site.contact.email}`,
    Icon: IconArrowRight,
  },
  {
    label: 'Instagram',
    value: site.social.instagramHandle,
    href: site.social.instagram,
    Icon: IconInstagram,
  },
];

export default function ContactePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-glow" />
        <div className="container-page relative pb-12 pt-36 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-electric-bright">
            Contacte
          </p>
          <h1 className="mt-4 font-display text-4xl font-extrabold sm:text-5xl">
            Parlem del teu esdeveniment
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-text-gray">
            Demana el teu pressupost gratuït i sense compromís. Et responem el
            més ràpid possible.
          </p>
        </div>
      </section>

      <section className="container-page grid gap-5 pb-8 sm:grid-cols-3">
        {cards.map((c) => (
          <a
            key={c.label}
            href={c.href}
            target={c.href.startsWith('http') ? '_blank' : undefined}
            rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="panel group flex flex-col gap-3 p-6 transition-all hover:border-electric/40 hover:shadow-glow-soft"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-electric/30 bg-electric/10 text-electric-bright">
              <c.Icon className="h-5 w-5" />
            </span>
            <span className="text-xs uppercase tracking-widest text-text-gray">
              {c.label}
            </span>
            <span className="font-display text-lg font-bold text-platinum">
              {c.value}
            </span>
          </a>
        ))}
      </section>

      <div id="truca">
        <CallbackBand />
      </div>
    </>
  );
}
