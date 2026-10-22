// Uso: node scripts/audit-crawl.mjs [https://dominio]
// Rastrea sitemap(s) + enlaces internos y guarda audit/urls.json, audit/urls.csv y copias HTML en audit/backup/.
// No modifica nada del sitio. Requiere acceso de red al dominio.
import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const origin = new URL(process.argv[2] ?? 'https://detectiveprivadoenciudadreal.es').origin;
const UA = 'ModusOperandiAudit/1.0';
const get = async (u) => fetch(u, { redirect: 'manual', headers: { 'user-agent': UA } });
const pick = (re, s) => (s.match(re)?.[1] ?? '').replace(/\s+/g, ' ').trim();
const meta = (name, s) => pick(new RegExp(`<meta[^>]+name=["']${name}["'][^>]*content=["']([^"']*)`, 'i'), s);

async function sitemapUrls(u, depth = 0) {
  const r = await get(u).catch(() => null);
  if (!r?.ok || depth > 3) return [];
  const locs = [...(await r.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  const nested = locs.filter((l) => /\.xml(\?|$)/.test(l));
  return [...locs.filter((l) => !nested.includes(l)), ...(await Promise.all(nested.map((n) => sitemapUrls(n, depth + 1)))).flat()];
}

const queue = new Set([...(await sitemapUrls(`${origin}/sitemap_index.xml`)), ...(await sitemapUrls(`${origin}/sitemap.xml`)), `${origin}/`]);
const done = new Map();
await mkdir('audit/backup', { recursive: true });

while (queue.size) {
  const [u] = queue; queue.delete(u);
  if (done.has(u)) continue;
  const r = await get(u).catch((e) => ({ status: 0, headers: new Headers(), text: async () => '', err: e.message }));
  const row = { url: u, status: r.status, location: r.headers.get('location') ?? '' };
  if (r.status === 200 && (r.headers.get('content-type') ?? '').includes('text/html')) {
    const html = await r.text();
    Object.assign(row, {
      title: pick(/<title[^>]*>([^<]*)/i, html), description: meta('description', html), robots: meta('robots', html),
      canonical: pick(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)/i, html),
      h1: [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => m[1].replace(/<[^>]+>/g, '').trim()),
      h2: [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) => m[1].replace(/<[^>]+>/g, '').trim()),
      words: html.replace(/<(script|style)[\s\S]*?<\/\1>/gi, '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length,
    });
    const links = [...html.matchAll(/<a[^>]+href=["']([^"'#]+)/gi)].map((m) => { try { return new URL(m[1], u); } catch { return null; } }).filter(Boolean);
    row.internalLinks = [...new Set(links.filter((l) => l.origin === origin).map((l) => l.origin + l.pathname + l.search))];
    row.externalLinks = [...new Set(links.filter((l) => l.origin !== origin && /^https?:/.test(l.protocol)).map((l) => l.href))];
    for (const l of row.internalLinks) if (!done.has(l) && !/\.(jpe?g|png|webp|gif|svg|pdf|css|js|ico|zip)$/i.test(l) && !l.includes('/wp-')) queue.add(l);
    await writeFile(`audit/backup/${createHash('sha1').update(u).digest('hex').slice(0, 12)}.html`, html);
    row.backup = `${createHash('sha1').update(u).digest('hex').slice(0, 12)}.html`;
  }
  done.set(u, row);
  await new Promise((r) => setTimeout(r, 300));
}

const rows = [...done.values()];
await writeFile('audit/urls.json', JSON.stringify(rows, null, 2));
const q = (v) => `"${String(Array.isArray(v) ? v.join(' | ') : v ?? '').replace(/"/g, '""')}"`;
const cols = ['url', 'status', 'location', 'title', 'description', 'robots', 'canonical', 'h1', 'words', 'backup'];
await writeFile('audit/urls.csv', [cols.join(','), ...rows.map((r) => cols.map((c) => q(r[c])).join(','))].join('\n'));
console.log(`${rows.length} URL guardadas en audit/urls.json y audit/urls.csv`);
