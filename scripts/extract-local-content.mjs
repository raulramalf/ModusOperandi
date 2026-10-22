// Extrae el texto de las páginas auditadas (audit/backup) a src/content/local.json.
// Contenido provisional hasta importar a Sanity. Solo conserva texto semántico (sin imágenes ni maquetación).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const rows = JSON.parse(readFileSync('audit/urls.json', 'utf8'));
const KEEP = ['p', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'strong', 'em', 'blockquote', 'a', 'br', 'b'];
const clean = (html) =>
  html
    .replace(/<(script|style|noscript|svg|form|iframe)[\s\S]*?<\/\1>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<h1[\s\S]*?<\/h1>/gi, '')
    .replace(/<(\/?)([a-z0-9]+)([^>]*)>/gi, (m, s, tag, attrs) => {
      tag = tag.toLowerCase();
      if (!KEEP.includes(tag)) return '';
      if (tag === 'a' && !s) { const h = attrs.match(/href=["']([^"']+)/i)?.[1]; return h ? `<a href="${h.replace(/^https?:\/\/detectiveprivadoenciudadreal\.es/, '')}">` : '<a>'; }
      return `<${s}${tag}>`;
    })
    .replace(/&nbsp;/g, ' ').replace(/<(p|li|h\d|strong|em)>\s*<\/\1>/g, '').replace(/\n\s*\n+/g, '\n').replace(/Categor[ií]as\s*<a[\s\S]*$/i, '').trim();
const region = (h, isArticle) => {
  if (isArticle) return h.match(/<div class="entry-content"[^>]*>([\s\S]*?)<\/div>\s*<\/article>/)?.[1] ?? '';
  const a = h.indexOf('id="content"'); return a < 0 ? '' : h.slice(h.indexOf('>', a) + 1, h.indexOf('<footer', a));
};
const pick = (re, s) => (s.match(re)?.[1] ?? '').trim();
const wanted = {
  '/infedilidades/': 'post', '/emilafs-2/': 'post', '/acceder-al-movil-de-tu-pareja-es-delito/': 'post',
  '/investigaciones-a-politicos/': 'post', '/modus-operandi/': 'page',
};
const out = [];
for (const r of rows.filter((x) => x.backup)) {
  const path = new URL(r.url).pathname;
  const kind = wanted[path];
  if (!kind) continue;
  const h = readFileSync(`audit/backup/${r.backup}`, 'utf8');
  out.push({
    kind, path, title: r.h1[0] || r.title.split(' - ')[0], seoTitle: r.title, description: r.description || '',
    publishedAt: pick(/property="article:published_time" content="([^"]+)/, h) || undefined,
    updatedAt: pick(/property="article:modified_time" content="([^"]+)/, h) || undefined,
    category: pick(/rel="category tag"[^>]*>([^<]+)/, h) || undefined,
    // Pendiente de decisión del cliente: nombra a personas concretas.
    hold: path === '/investigaciones-a-politicos/',
    html: clean(region(h, kind === 'post')),
  });
}
mkdirSync('src/content', { recursive: true });
writeFileSync('src/content/local.json', JSON.stringify(out, null, 2));
out.forEach((o) => console.log(o.path, o.html.length, o.category, o.publishedAt));
