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
  // Datos tomados de la web actual (auditoría 22/10/2026). Pendiente de confirmación por el cliente.
  phone: '635 38 79 11' as string | null,
  email: 'detectives@modus-operandi.es' as string | null,
  address: { street: 'Avenida Descubrimientos, 3', postalCode: '13005' } as { street: string; postalCode: string } | null,
  licenseNumber: '4296 (Ministerio del Interior); despacho nº 11073 RNSP' as string | null,
  openingHours: null as string | null,
  // Solo servicios confirmados por el cliente / presentes en el sitio actual.
  // Enlaces a páginas existentes de la web actual (resúmenes pendientes de revisión del cliente).
  services: [
    { title: 'Infidelidades', href: '/infedilidades/', summary: 'Investigación de infidelidades en la pareja.' },
    { title: 'Control de personal', href: '/emilafs-2/', summary: 'Control de personal y de colaboradores en empresas e instituciones.' },
    { title: 'Quiénes somos', href: '/modus-operandi/', summary: 'Cómo trabajamos: planificación, análisis e informe final detallado.' },
  ] as { title: string; href: string; summary: string }[],
  serviceArea: ['Ciudad Real', 'Madrid', 'Toledo', 'Albacete'],
  social: [] as string[],
  defaultOgImage: '/og-default.jpg',
};
