import { site } from '../config/site';
export const GET = () =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`, { headers: { 'Content-Type': 'text/plain' } });
