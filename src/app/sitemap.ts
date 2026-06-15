import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

const routes = [
  '',
  '/qui-som',
  '/artistes',
  '/lloguer-equips',
  '/casaments',
  '/esdeveniments-empresa',
  '/festes-majors',
  '/galeria',
  '/blog',
  '/contacte',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return routes.map((route) => ({
    url: `${site.url}${route}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.7,
  }));
}
