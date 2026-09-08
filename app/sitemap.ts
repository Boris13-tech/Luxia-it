import { allRoutes, site } from '@/lib/content';
export default function sitemap() {
  return ['', ...allRoutes].map((route) => ({
    url: site.origin + (route ? '/' + route : '/'),
    changeFrequency: 'monthly' as const,
    priority: route ? 0.7 : 1,
  }));
}
