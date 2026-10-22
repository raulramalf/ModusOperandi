import type { ImageMetadata } from 'astro';

const all = import.meta.glob<{ default: ImageMetadata }>('../assets/*.{jpg,png}', { eager: true });
export const asset = (name: string) => all[`../assets/${name}`].default;

/** Imagen destacada por ruta histórica. Imágenes originales de la web actual (derechos a confirmar con el cliente). */
const byPath: Record<string, { file: string; alt: string }> = {
  '/infedilidades/': { file: 'detectives-infidelidades-2.jpg', alt: 'Detective con cámara fotográfica siguiendo a una pareja en la calle' },
  '/emilafs-2/': { file: 'investigador-privado-empresa.jpg', alt: 'Investigador analizando gráficos con una lupa' },
  '/acceder-al-movil-de-tu-pareja-es-delito/': { file: 'Movil-Pareja.jpg', alt: 'Mujer revisando el móvil de su pareja en la cama' },
  '/modus-operandi/': { file: 'espiando.jpg', alt: 'Detective vigilando con una cámara desde un coche' },
};
export const imageFor = (path: string) => (byPath[path] ? { src: asset(byPath[path].file), alt: byPath[path].alt } : undefined);
