import type { Metadata } from 'next';
import { ContacteForm } from '@/components/ContacteForm';
import {
  IconPhone,
  IconInstagram,
  IconWhatsApp,
  IconArrowRight,
} from '@/components/ui/Icons';
import { site } from '@/lib/site';

export function generateMetadata(): Metadata {
  return {
    title: 'Contacte',
    description:
      'Contacta amb 360Events per al teu pressupost gratuït. Telèfon, email, Instagram i WhatsApp per a esdeveniments a Catalunya.',
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

export default function ContactePage({
  searchParams,
}: {
  searchParams: { assumpte?: string };
}) {
  const assumpte =
    typeof searchParams.assumpte === 'string' ? searchParams.assumpte : '';

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

      {/* Dades de contacte */}
      <section className="container-page grid gap-5 pb-6 sm:grid-cols-3">
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

      {/* WhatsApp destacat */}
      <section className="container-page pb-12">
        <a
          href={site.contact.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 rounded-2xl border border-[#25D366]/40 bg-[#25D366]/10 px-6 py-4 font-semibold text-platinum transition-colors hover:bg-[#25D366]/20"
        >
          <IconWhatsApp className="h-6 w-6 text-[#25D366]" />
          Parla amb nosaltres per WhatsApp
        </a>
      </section>

      {/* Formulari */}
      <section className="container-page pb-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
              Escriu-nos
            </h2>
            <p className="mt-4 text-text-gray">
              Omple el formulari i et contactarem amb una proposta a mida.
            </p>
          </div>
          <ContacteForm defaultAssumpte={assumpte} />
        </div>
      </section>
    </>
  );
}
