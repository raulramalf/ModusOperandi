// Uso: node scripts/check-urls.mjs <base-nueva> [audit/urls.json] [audit/redirect-map.json]
// Compara cada URL antigua con la nueva web: debe devolver 200 (misma ruta) o 301 al destino mapeado.
import { readFile } from 'node:fs/promises';
const base = (process.argv[2] ?? '').replace(/\/$/, '');
if (!base) { console.error('Indica la base de la nueva web (staging).'); process.exit(2); }
const urls = JSON.parse(await readFile(process.argv[3] ?? 'audit/urls.json', 'utf8')).filter((r) => r.status === 200);
const map = JSON.parse(await readFile(process.argv[4] ?? 'audit/redirect-map.json', 'utf8').catch(() => '{}'));
let bad = 0;
for (const { url, canonical, title, description } of urls) {
  const p = new URL(url).pathname + new URL(url).search;
  const r = await fetch(base + p, { redirect: 'manual' });
  const dest = map[p];
  const ok = dest ? r.status === 301 && new URL(r.headers.get('location'), base).pathname === dest : r.status === 200;
  let note = '';
  if (ok && r.status === 200) {
    const h = await r.text();
    const t = h.match(/<title>([^<]*)/)?.[1]?.trim();
    const c = h.match(/rel="canonical" href="([^"]+)/)?.[1];
    if (/noindex/i.test(h)) note += ' NOINDEX!';
    if (title && t !== title) note += ` título distinto (${t})`;
    if (canonical && c && new URL(c).pathname !== new URL(canonical).pathname) note += ` canonical distinta (${c})`;
  }
  if (!ok || note) { bad++; console.log(`${ok ? 'REVISAR' : 'FALLO'} ${p} → ${r.status}${note}`); }
}
console.log(`${urls.length} URL comprobadas, ${bad} incidencias`);
process.exit(bad ? 1 : 0);
