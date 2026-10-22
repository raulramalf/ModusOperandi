import { defineConfig } from 'astro/config';

// trailingSlash: 'always' replica el comportamiento por defecto histórico de WordPress.
// CONFIRMAR con audit/urls.json antes del lanzamiento.
export default defineConfig({
  site: 'https://detectiveprivadoenciudadreal.es',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  compressHTML: true,
});
