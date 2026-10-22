import { site } from '../config/site';

/** JSON-LD solo con datos verificados (los `null` se omiten). */
export function localBusiness() {
  const o: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    areaServed: { '@type': 'City', name: site.city },
  };
  if (site.phone) o.telephone = site.phone;
  if (site.email) o.email = site.email;
  if (site.openingHours) o.openingHours = site.openingHours;
  if (site.social.length) o.sameAs = site.social;
  if (site.address)
    o.address = { '@type': 'PostalAddress', streetAddress: site.address.street,
      postalCode: site.address.postalCode, addressLocality: site.city,
      addressRegion: site.region, addressCountry: 'ES' };
  return o;
}

export const breadcrumbs = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })),
});

export const article = (p: { title: string; url: string; published?: string; updated?: string; description?: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: p.title,
  mainEntityOfPage: p.url,
  datePublished: p.published,
  dateModified: p.updated ?? p.published,
  description: p.description,
  publisher: { '@id': `${site.url}/#organization` },
});
