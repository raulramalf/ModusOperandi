import { defineField, defineType } from 'sanity';

const seo = defineType({
  name: 'seo', title: 'SEO', type: 'object',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.max(60).warning('Ideal ≤ 60 caracteres') }),
    defineField({ name: 'description', type: 'text', rows: 3, validation: (r) => r.max(160).warning('Ideal ≤ 160 caracteres') }),
    defineField({ name: 'canonical', type: 'url', description: 'Solo si difiere de la URL de la página.' }),
    defineField({ name: 'noindex', type: 'boolean', initialValue: false }),
  ],
});

const body = defineField({
  name: 'body', type: 'array',
  of: [{ type: 'block' }, { type: 'image', fields: [{ name: 'alt', type: 'string', validation: (r) => r.required() }] }],
});
const mainImage = defineField({ name: 'mainImage', type: 'image', options: { hotspot: true },
  fields: [{ name: 'alt', type: 'string', title: 'Texto alternativo' }] });

const pathField = (req: boolean) => defineField({
  name: 'path', type: 'string', title: 'Ruta exacta',
  description: 'Ruta histórica con barras inicial y final, p. ej. /mi-servicio/. NO cambiar en páginas migradas.',
  validation: (r) => { const v = r.regex(/^\/([a-z0-9\-_/]+\/)?$/, { name: 'ruta' }); return req ? v.required() : v; },
});

const page = defineType({ name: 'page', type: 'document', title: 'Página', fields: [
  defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
  defineField({ name: 'slug', type: 'slug', options: { source: 'title' } }),
  pathField(true), mainImage, body, defineField({ name: 'seo', type: 'seo' }),
] });

const post = defineType({ name: 'post', type: 'document', title: 'Artículo', fields: [
  defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
  defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
  pathField(false),
  defineField({ name: 'excerpt', type: 'text', rows: 3 }),
  defineField({ name: 'publishedAt', type: 'datetime' }),
  defineField({ name: 'category', type: 'reference', to: [{ type: 'category' }] }),
  mainImage, body, defineField({ name: 'seo', type: 'seo' }),
  // Trazabilidad de la automatización (sin credenciales ni datos personales).
  defineField({ name: 'source', type: 'string', title: 'Origen', options: { list: ['manual', 'make-ia'] }, initialValue: 'manual' }),
  defineField({ name: 'sources', type: 'array', title: 'Fuentes citadas', of: [{ type: 'url' }] }),
] });

const category = defineType({ name: 'category', type: 'document', title: 'Categoría', fields: [
  defineField({ name: 'title', type: 'string' }),
  defineField({ name: 'slug', type: 'slug', options: { source: 'title' } }),
] });

export const schemaTypes = [seo, page, post, category];
