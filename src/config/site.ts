/**
 * Datos de empresa. NADA aquí está verificado todavía: rellenar con datos
 * facilitados por el cliente (nº de licencia de la DGP, teléfono, dirección…).
 * Las piezas con `null` no se renderizan ni se incluyen en JSON-LD.
 */
export const site = {
  name: 'Modus Operandi Detectives Privados',
  url: 'https://detectiveprivadoenciudadreal.es',
  locale: 'es-ES',
  city: 'Ciudad Real',
  region: 'Castilla-La Mancha',
  phone: null as string | null,
  email: null as string | null,
  address: null as { street: string; postalCode: string } | null,
  licenseNumber: null as string | null,
  openingHours: null as string | null,
  // Solo servicios confirmados por el cliente / presentes en el sitio actual.
  services: [] as { title: string; href: string; summary: string }[],
  social: [] as string[],
  defaultOgImage: '/og-default.jpg',
};
