import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { toHTML } from '@portabletext/to-html';

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
export const getPages = () => q<Entry>(`*[_type=="page" && defined(path)]{${FIELDS}}`);
export const getPosts = () => q<Entry>(`*[_type=="post" && defined(slug.current)]|order(publishedAt desc){${FIELDS}}`);
export const getCategories = () =>
  q<{ title: string; slug: string }>(`*[_type=="category"]{title, "slug": slug.current}`);

const builder = client ? imageUrlBuilder(client) : null;
export const imgUrl = (src: any, w = 1200) => builder?.image(src).width(w).auto('format').url();
export const renderBody = (body: any[] = []) => toHTML(body);
