import { site } from './site';

/** Dades estructurades Service per a les pàgines de servei (SEO). */
export function serviceJsonLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    serviceType: name,
    url: `${site.url}${path}`,
    areaServed: { '@type': 'AdministrativeArea', name: site.area },
    provider: {
      '@type': 'LocalBusiness',
      name: site.legalName,
      telephone: site.contact.phoneIntl,
      email: site.contact.email,
      url: site.url,
    },
  };
}
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
