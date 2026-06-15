/**
 * Configuració central del lloc 360Events.cat.
 * Dades de marca, contacte i navegació reutilitzables a tota la web.
 */

export const site = {
  name: '360 EVENTS',
  legalName: '360Events.cat',
  domain: '360events.cat',
  url: 'https://360events.cat',
  description:
    'Contractació d’artistes, producció d’esdeveniments i lloguer d’equips de so i il·luminació a Catalunya. Viu una experiència 360°.',
  tagline: 'Espectacle, música i llums per als teus esdeveniments',
  contact: {
    phone: '687 755 444',
    phoneIntl: '+34687755444',
    phoneHref: 'tel:+34687755444',
    email: 'info@360events.cat',
    whatsapp: 'https://wa.me/34687755444',
  },
  social: {
    instagram: 'https://instagram.com/360events.cat',
    instagramHandle: '@360events.cat',
    facebook: 'https://facebook.com/360events.cat',
    tiktok: 'https://tiktok.com/@360events.cat',
    youtube: 'https://youtube.com/@360events.cat',
  },
  area: 'Catalunya',
} as const;

export type NavLink = { label: string; href: string };

export const navLinks: NavLink[] = [
  { label: 'Qui som', href: '/qui-som' },
  { label: 'Artistes', href: '/artistes' },
  { label: 'Lloguer d’equips', href: '/lloguer-equips' },
  { label: 'Esdeveniments', href: '/#esdeveniments' },
  { label: 'Galeria', href: '/galeria' },
  { label: 'Contacte', href: '/contacte' },
];

export const footerServices: NavLink[] = [
  { label: 'Contractació artística', href: '/artistes' },
  { label: 'Lloguer d’equips', href: '/lloguer-equips' },
  { label: 'Casaments', href: '/casaments' },
  { label: 'Esdeveniments d’empresa', href: '/esdeveniments-empresa' },
  { label: 'Festes majors', href: '/festes-majors' },
];

export const footerCompany: NavLink[] = [
  { label: 'Qui som', href: '/qui-som' },
  { label: 'Galeria', href: '/galeria' },
  { label: 'Contacte', href: '/contacte' },
];
