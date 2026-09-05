import { MetadataRoute } from 'next';
import { getDb } from '@/lib/db';
import { NEIGHBORHOODS } from '@/data/neighborhoods';
import { ARTICLES } from '@/data/articles';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://goizet-gestion.fr';

  const staticPages = [
    '',
    '/biens',
    '/estimation',
    '/gestion-locative',
    '/quartiers',
    '/journal',
    '/contact',
    '/mentions-legales',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const db = getDb();
  const propertyUrls = db.properties
    .filter((p: any) => p.status === 'Published')
    .map((p: any) => ({
      url: `${baseUrl}/biens/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));

  const neighborhoodUrls = NEIGHBORHOODS.map((h) => ({
    url: `${baseUrl}/quartiers/${h.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  const articleUrls = ARTICLES.map((a) => ({
    url: `${baseUrl}/journal/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  return [...staticPages, ...propertyUrls, ...neighborhoodUrls, ...articleUrls];
}
