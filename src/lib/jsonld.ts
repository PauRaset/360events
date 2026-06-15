import { site } from './site';

/** Dades estructurades LocalBusiness per a la home (SEO). */
export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: site.legalName,
    description: site.description,
    url: site.url,
    telephone: site.contact.phoneIntl,
    email: site.contact.email,
    areaServed: {
      '@type': 'AdministrativeArea',
      name: site.area,
    },
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'Catalunya',
      addressCountry: 'ES',
    },
    sameAs: [
      site.social.instagram,
      site.social.facebook,
      site.social.tiktok,
      site.social.youtube,
    ],
  };
}
