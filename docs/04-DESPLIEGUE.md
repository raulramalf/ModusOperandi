# Despliegue (GitHub → Cloudflare Pages)
1. Cloudflare Pages → Conectar repositorio. Build: `npm run build`, salida `dist`, Node 22.
2. Variables (Settings → Environment variables, **no** en el repo): `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_VERSION`, y `SANITY_READ_TOKEN` solo si el dataset es privado.
3. Rama `main` = producción; resto de ramas = previews en `*.pages.dev`.
4. **Reconstrucción por publicación:** Pages → Settings → Builds → *Deploy hooks* crea una URL secreta. En Sanity (manage.sanity.io → API → Webhooks) crear webhook a esa URL con disparador *Publish/Update/Delete* y filtro `_type in ["page","post","category"]`. Solo se dispara con contenido publicado; los borradores no lo activan. Guardar la URL del hook como secreto.
5. Vista previa de borradores: no incluida (requeriría SSR/Functions). Alternativa gratuita: Studio muestra el contenido; o un build en rama `staging` con `perspective: 'previewDrafts'` y token de lectura.
6. Verificar planes/límites vigentes de Cloudflare Pages, Sanity y Make **antes** de contratar (ver `docs/06-COSTES.md`).
