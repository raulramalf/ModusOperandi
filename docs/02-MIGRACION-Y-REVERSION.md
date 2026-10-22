# Migración y plan de reversión
- Mantener el sitio antiguo activo en su hosting hasta superar las pruebas. El cambio de producción es solo DNS (reducir TTL a 300 s con 48 h de antelación).
- Probar en `*.pages.dev`: `npm run audit:redirects -- https://<proyecto>.pages.dev` debe terminar sin incidencias (200 con mismo título/canonical, o 301 al destino mapeado).
- Staging: la rama `staging` y los preview deployments usan `X-Robots-Tag: noindex` (Cloudflare Pages → `_headers` en preview) o protección con Cloudflare Access; el dominio de producción nunca.
- **Reversión:** devolver los registros DNS al hosting anterior (anotar valores actuales antes) y mantener la copia WordPress ≥ 90 días. Criterios de reversión: >5 % de URL con 404/5xx, noindex accidental, canonical errónea masiva o caída de formularios.
- No cambiar el dominio, ni el www/no-www, ni HTTPS existentes sin justificación documentada.
- Pre-lanzamiento: enviar sitemap en Search Console; post-lanzamiento comparar clics, impresiones, consultas y páginas indexadas contra el mismo periodo previo (estacionalidad) a 2, 4 y 12 semanas.
