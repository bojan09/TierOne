/**
 * Lightweight per-route SEO tags — no react-helmet dependency.
 *
 * Sets document.title plus the meta/link tags search engines and social
 * previews read, directly via the DOM. Each route that calls `useSeo` fully
 * owns these tags for as long as it's mounted; the next route's `useSeo`
 * call overwrites them, so there's no cleanup/revert step needed between
 * route changes in this single-page app.
 */
import { useEffect } from 'react';

export const SITE_URL = 'https://tier-one-tau.vercel.app';
export const SITE_NAME = 'TierOne';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.svg`;

export interface SeoOptions {
  title: string;
  description: string;
  /** Site-relative path, e.g. "/learn/windows". Used to build the canonical URL and og:url. */
  path: string;
  type?: 'website' | 'article';
  image?: string;
  /** Set true to keep this page out of search results (e.g. auth-only utility pages). */
  noindex?: boolean;
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function useSeo({ title, description, path, type = 'website', image, noindex }: SeoOptions) {
  useEffect(() => {
    const fullTitle = title.endsWith(SITE_NAME) ? title : `${title} — ${SITE_NAME}`;
    const url = `${SITE_URL}${path}`;
    const ogImage = image ?? DEFAULT_OG_IMAGE;

    document.title = fullTitle;
    setMeta('name', 'description', description);
    setMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow');
    setLink('canonical', url);

    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:site_name', SITE_NAME);
    setMeta('property', 'og:image', ogImage);

    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', ogImage);
  }, [title, description, path, type, image, noindex]);
}

/** Injects (or replaces) a single JSON-LD <script> tag, keyed by id. */
export function useJsonLd(id: string, data: Record<string, unknown> | null) {
  useEffect(() => {
    if (!data) return;
    let el = document.head.querySelector<HTMLScriptElement>(`script[data-jsonld="${id}"]`);
    if (!el) {
      el = document.createElement('script');
      el.type = 'application/ld+json';
      el.setAttribute('data-jsonld', id);
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);
    return () => {
      el?.remove();
    };
  }, [id, data]);
}
