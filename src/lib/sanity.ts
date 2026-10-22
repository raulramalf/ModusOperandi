import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { toHTML } from '@portabletext/to-html';
import local from '../content/local.json';

const projectId = import.meta.env.SANITY_PROJECT_ID;
export const hasSanity = Boolean(projectId);

const client = hasSanity
  ? createClient({
      projectId,
      dataset: import.meta.env.SANITY_DATASET ?? 'production',
      apiVersion: import.meta.env.SANITY_API_VERSION ?? '2025-01-01',
      token: import.meta.env.SANITY_READ_TOKEN || undefined,
      useCdn: false,
      perspective: 'published', // los borradores nunca llegan a producción
    })
  : null;

export interface Seo { title?: string; description?: string; canonical?: string; noindex?: boolean; ogImage?: any }
export interface Entry {
  html?: string; // contenido provisional local (hasta importar a Sanity)
  _id: string; title: string; slug: string; path: string; body: any[];
  seo?: Seo; publishedAt?: string; updatedAt?: string; excerpt?: string;
  category?: { title: string; slug: string }; mainImage?: any;
}

async function q<T>(query: string, params = {}): Promise<T[]> {
  if (!client) return [];
  return client.fetch<T[]>(query, params);
}

const FIELDS = `_id, title, "slug": slug.current, path, body, seo, publishedAt, "updatedAt": _updatedAt,
  excerpt, mainImage, "category": category->{title, "slug": slug.current}`;

/** `path` conserva la ruta histórica exacta (p. ej. /detective-privado-ciudad-real/). */
const slugify = (t: string) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
const fromLocal = (kind: 'page' | 'post'): Entry[] =>
  local.filter((l) => l.kind === kind && !l.hold).map((l) => ({
    _id: l.path, title: l.title, slug: l.path.replace(/\//g, ''), path: l.path, body: [], html: l.html,
    seo: { title: l.seoTitle, description: l.description || undefined },
    publishedAt: l.publishedAt, updatedAt: l.updatedAt ?? l.publishedAt,
    excerpt: l.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().replace(/^(.{0,150})\s.*$/, '$1…'),
    category: l.category ? { title: l.category, slug: slugify(l.category) } : undefined,
  }));

export const getPages = async () => (hasSanity ? q<Entry>(`*[_type=="page" && defined(path)]{${FIELDS}}`) : fromLocal('page'));
export const getPosts = async () =>
  hasSanity ? q<Entry>(`*[_type=="post" && defined(slug.current)]|order(publishedAt desc){${FIELDS}}`)
    : fromLocal('post').sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''));
export const getCategories = async () => {
  if (hasSanity) return q<{ title: string; slug: string }>(`*[_type=="category"]{title, "slug": slug.current}`);
  const m = new Map<string, string>();
  (await getPosts()).forEach((p) => p.category && m.set(p.category.slug, p.category.title));
  return [...m].map(([slug, title]) => ({ title, slug }));
};

const builder = client ? imageUrlBuilder(client) : null;
export const imgUrl = (src: any, w = 1200) => builder?.image(src).width(w).auto('format').url();
export const renderBody = (body: any[] = []) => toHTML(body);
