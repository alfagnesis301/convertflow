import { useEffect } from 'react';
import type { MetaTags } from '../lib/seo';

interface SEOHeadProps {
  meta: MetaTags;
}

function setMeta(name: string, content: string, property = false) {
  const attr = property ? 'property' : 'name';
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]`;
  let el = document.querySelector<HTMLLinkElement>(selector);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    if (hreflang) el.setAttribute('hreflang', hreflang);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export default function SEOHead({ meta }: SEOHeadProps) {
  useEffect(() => {
    document.title = meta.title;

    setMeta('description', meta.description);

    // Open Graph
    setMeta('og:title', meta.ogTitle, true);
    setMeta('og:description', meta.ogDescription, true);
    setMeta('og:url', meta.ogUrl, true);
    setMeta('og:image', meta.ogImage, true);
    setMeta('og:type', 'website', true);
    setMeta('og:site_name', 'ConvertFlow', true);

    // Twitter
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', meta.twitterTitle);
    setMeta('twitter:description', meta.twitterDescription);
    setMeta('twitter:image', meta.ogImage);

    // Canonical
    setLink('canonical', meta.canonical);

    // Hreflang alternates
    meta.alternates.forEach(({ hreflang, href }) => {
      setLink('alternate', href, hreflang);
    });
  }, [meta]);

  return null;
}
