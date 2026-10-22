# 1. Auditoría previa (PENDIENTE — bloqueante)

No se ha ejecutado: el entorno de desarrollo no puede acceder al dominio ni a Wayback. No hay datos de URL, tráfico ni enlaces; **no se han inventado**.

## Pasos (en un equipo con acceso)
1. `npm run audit:crawl` → `audit/urls.json`, `audit/urls.csv` (estado, título, descripción, robots, canonical, H1/H2, palabras, enlaces) y copia HTML en `audit/backup/`.
2. Descargar también: `/wp-content/uploads` (imágenes), `sitemap*.xml`, `robots.txt`, `.htaccess` y exportación de WordPress (Herramientas → Exportar) como copia de seguridad. Guardar fuera del repositorio público si contiene datos personales.
3. Search Console (pedir acceso al cliente): exportar 16 meses de Páginas y Consultas, informe de enlaces externos y de indexación. Marcar URL con clics/impresiones/enlaces.
4. GA4: páginas con contactos/conversiones (llamadas, formularios). 
5. Crear `audit/redirect-map.json` `{ "/antigua/": "/nueva/" }` solo para las URL que deban cambiar, con justificación por escrito.
6. Decidir `trailingSlash` (por defecto `always`, como WordPress) y revisar rutas de posts/categorías (`/blog/…` es solo un valor por defecto; si hoy son `/slug/`, rellenar `path` en Sanity).
7. Importar páginas y artículos a Sanity con su `path`, título SEO, metadescripción y canonical originales.

## Hallazgos
_Rellenar tras ejecutar._
