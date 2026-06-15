import Link from 'next/link';
import { Logo } from './Logo';
import {
  IconInstagram,
  IconFacebook,
  IconTikTok,
  IconYouTube,
} from './Icons';
import { site, footerServices } from '@/lib/site';

const socials = [
  { label: 'Instagram', href: site.social.instagram, Icon: IconInstagram },
  { label: 'Facebook', href: site.social.facebook, Icon: IconFacebook },
  { label: 'TikTok', href: site.social.tiktok, Icon: IconTikTok },
  { label: 'YouTube', href: site.social.youtube, Icon: IconYouTube },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-base-2/60">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        {/* Marca */}
        <div>
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-text-gray">
            Contractació d’artistes, producció d’esdeveniments i lloguer d’equips
            de so i il·luminació arreu de {site.area}. Viu una experiència 360°.
          </p>
          <div className="mt-6 flex gap-3">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-silver transition-all hover:border-electric/60 hover:text-platinum hover:shadow-glow"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Serveis */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-platinum">
            Serveis
          </h3>
          <ul className="mt-5 space-y-3">
            {footerServices.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="text-sm text-text-gray transition-colors hover:text-platinum"
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contacte */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-platinum">
            Contacte
          </h3>
          <ul className="mt-5 space-y-3 text-sm text-text-gray">
            <li>
              <a
                href={site.contact.phoneHref}
                className="transition-colors hover:text-platinum"
              >
                {site.contact.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.contact.email}`}
                className="transition-colors hover:text-platinum"
              >
                {site.contact.email}
              </a>
            </li>
            <li>
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-platinum"
              >
                {site.social.instagramHandle}
              </a>
            </li>
            <li>{site.area}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-xs text-text-gray sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.legalName}. Tots els drets
            reservats.
          </p>
          <p>Espectacle · Música · Llums · Experiència 360°</p>
        </div>
      </div>
    </footer>
  );
}
