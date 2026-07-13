import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://vidhyabookstore.com';

  // Base pages map
  const routes = ['', '/about', '/contact', '/gallery', '/faq', '/policies', '/bulk'].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1.0 : 0.8,
    })
  );

  // Mock catalog products (normally fetched from database client)
  const productIds = [
    'upsc-polity-laxmikanth',
    'hc-verma-physics-v1',
    'mppsc-prelims-kautilya-1',
    'rd-sharma-maths-10',
    'casio-fx991ex-calculator'
  ];

  const productRoutes = productIds.map((id) => ({
    url: `${baseUrl}/books/${id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  return [...routes, ...productRoutes];
}
