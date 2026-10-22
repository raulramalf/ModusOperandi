# Modus Operandi — Web (Astro + Sanity + Cloudflare Pages)

Web estática sin WordPress. Frontend Astro/TypeScript; contenido en Sanity; despliegue en Cloudflare Pages; flujo editorial con Make.

**Estado:** esqueleto técnico terminado y compilando. **La auditoría del sitio actual NO se ha podido ejecutar** (el entorno de desarrollo no tenía acceso a `detectiveprivadoenciudadreal.es`). Hasta completarla no hay que migrar contenido, cambiar DNS ni publicar. Ver `docs/01-AUDITORIA.md`.

## Uso
```bash
npm install
cp .env.example .env     # rellenar con el proyecto Sanity
npm run dev              # desarrollo
npm run build            # astro check + build → dist/
npm run audit:crawl      # (desde un equipo con acceso) auditoría del sitio actual
npm run audit:redirects -- https://staging.pages.dev   # compara URL antiguas vs nueva web
```
Sanity Studio: `cd sanity && npm install && SANITY_STUDIO_PROJECT_ID=xxx npm run dev`.

## Estructura
- `src/pages/[...slug].astro` — páginas y artículos del CMS en su **ruta histórica exacta** (campo `path`).
- `src/lib/sanity.ts` — consultas (solo contenido publicado: los borradores nunca se despliegan).
- `src/config/site.ts` — datos de empresa; los `null`/vacíos no se renderizan ni van a JSON-LD.
- `public/_redirects`, `public/_headers` — redirecciones 301 y cabeceras en Cloudflare.
- `scripts/` — rastreo/auditoría y verificación de URL. `make/` — escenario editorial. `docs/` — documentación.
