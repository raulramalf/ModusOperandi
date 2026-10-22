import { getCategories, getPages, getPosts } from '../lib/sanity';
import { site } from '../config/site';

// Solo URL canónicas indexables (sin noindex, sin canonical externa).
export const GET = async () => {
  const [pages, posts] = await Promise.all([getPages(), getPosts()]);
  const entries = [
    { path: '/', lastmod: undefined as string | undefined },
    ...(await getCategories()).map((c) => ({ path: `/category/${c.slug}/`, lastmod: undefined as string | undefined })),
    { path: '/publicaciones/', lastmod: posts[0]?.updatedAt },
    ...[...pages, ...posts]
      .filter((e) => !e.seo?.noindex && (!e.seo?.canonical || e.seo.canonical === new URL(e.path ?? `/${e.slug}/`, site.url).href))
      .map((e) => ({ path: e.path ?? `/${e.slug}/`, lastmod: e.updatedAt })),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries
    .map((e) => `<url><loc>${site.url}${e.path}</loc>${e.lastmod ? `<lastmod>${e.lastmod.slice(0, 10)}</lastmod>` : ''}</url>`)
    .join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
};
