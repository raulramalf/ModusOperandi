# 1. Auditoría previa — rastreo del 22/10/2026

Fuente: `npm run audit:crawl` (datos en `audit/urls.json` y `audit/urls.csv`). **Search Console y GA4 siguen pendientes**: sin ellos no se sabe qué URL tienen tráfico, impresiones o enlaces externos.

## Inventario (23 URL rastreadas: 22 con 200, 1 con 301)
| Tipo | URL | Notas |
|---|---|---|
| Home | `/` | Título propio y metadescripción |
| Páginas | `/modus-operandi/`, `/publicaciones/`, `/politica-de-privacidad/`, `/politica-de-cookies/`, `/mas-informacion-sobre-las-cookies/` | |
| Contenido | `/infedilidades/`, `/emilafs-2/`, `/investigaciones-a-politicos/`, `/acceder-al-movil-de-tu-pareja-es-delito/` | Slugs con erratas/poco descriptivos; **se conservan**: no cambiar sin datos de Search Console |
| Categorías | `/category/familiar/`, `/category/laboral/`, `/category/politica/` | |
| Etiquetas | 8 URL `/tag/…` | Contenido fino (~300 palabras) |
| Autor | `/author/plesk_notifications_i42fw8f7/` | Expone un nombre de usuario interno |
| Redirección | `/politica-de-privacida/` → `/politica-de-privacidad/` (301) | Se mantiene en `audit/redirect-map.json` |

Sitemap (Yoast): 5 sub-sitemaps (posts, pages, categorías, etiquetas, autores). Todas las URL: `robots: index, follow`, canonical autorreferenciada. Sin www (el host `www.` no resuelve).

## Hallazgos
1. `robots.txt` actual declara `Sitemap: https://www.tudominio.com/sitemap.xml` (marcador de posición erróneo). Corregido en la web nueva.
2. `robots.txt` bloquea GPTBot, ChatGPT-User, Bytespider, Ahrefs, Semrush, etc. **Decisión del cliente** si mantenerlo; la web nueva de momento no lo replica.
3. La mayoría de páginas **no tienen metadescripción** (solo home, `/modus-operandi/` y `/publicaciones/`). Oportunidad de mejora sin cambiar URL.
4. Varias páginas sin H1 detectado (`/modus-operandi/`, `/publicaciones/`, privacidad…): revisar al migrar.
5. Datos de empresa públicos en la web actual (pendientes de confirmar con el cliente): tel. 635 38 79 11, detectives@modus-operandi.es, Avenida Descubrimientos 3, 13005 Ciudad Real, licencia Ministerio del Interior 4296, despacho 11073 RNSP; ámbito: Ciudad Real, Madrid, Toledo y Albacete.
6. Web actual: WordPress + Elementor Pro + GeneratePress + Yoast + WP Rocket; hosting Sol-Host.
7. `/investigaciones-a-politicos/` nombra a personas concretas: revisar riesgo legal/reputacional con el cliente antes de migrarla.

## Decisiones propuestas (a validar con Search Console)
- `trailingSlash: 'always'` — confirmado: todas las URL actuales terminan en `/`.
- Mantener todas las URL tal cual; categorías conservadas; etiquetas conservadas hasta ver su tráfico (si no tienen, 301 a su categoría).
- `/author/…`: decidir 301 a `/publicaciones/` (justificado: filtra un usuario interno). 
- Rutas de entradas: son `/slug/` en la raíz, **no** `/blog/slug/` → en Sanity rellenar `path` en cada entrada.

## Pendiente
Search Console (16 meses), GA4, exportación WordPress, `wp-content/uploads`, confirmación de datos del cliente.
