/**
 * Prerender script for vite-prerender-plugin.
 * Called at build time for each route in additionalPrerenderRoutes.
 *
 * Uses renderToString with StaticRouter so we can generate static HTML
 * for each URL without browser APIs.
 */
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';

// Routes to prerender
const ROUTES = [
  '/en/',
  '/es/',
  '/en/pdf-to-word',
  '/es/pdf-a-word',
  '/en/word-to-pdf',
  '/es/word-a-pdf',
  '/en/jpg-to-pdf',
  '/es/jpg-a-pdf',
  '/en/pdf-to-jpg',
  '/es/pdf-a-jpg',
  '/en/merge-pdf',
  '/es/unir-pdf',
  '/en/split-pdf',
  '/es/dividir-pdf',
  '/en/compress-pdf',
  '/es/comprimir-pdf',
  '/en/rotate-pdf',
  '/es/rotar-pdf',
  '/en/protect-pdf',
  '/es/proteger-pdf',
  '/en/unlock-pdf',
  '/es/desbloquear-pdf',
  '/en/pdf-tools',
  '/es/herramientas-pdf',
  '/en/pdf-converter',
  '/es/convertidor-pdf',
  '/en/image-to-pdf',
  '/es/imagen-a-pdf',
  '/en/office-to-pdf',
  '/es/office-a-pdf',
  '/en/about',
  '/es/sobre-nosotros',
  '/en/blog',
  '/es/blog',
  '/en/contact',
  '/es/contacto',
  '/en/privacy',
  '/es/privacidad',
  '/en/terms',
  '/es/terminos',
];

export async function prerender(data: { url: string }) {
  const url = data.url ?? '/en/';

  // Minimal polyfills for SSR (window/localStorage not available in Node)
  if (typeof globalThis.localStorage === 'undefined') {
    (globalThis as Record<string, unknown>).localStorage = {
      getItem: () => null,
      setItem: () => undefined,
      removeItem: () => undefined,
    };
  }
  if (typeof globalThis.navigator === 'undefined') {
    (globalThis as Record<string, unknown>).navigator = { language: 'en-US' };
  }

  let html = '';
  try {
    html = renderToString(
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    );
  } catch {
    // Fallback: return minimal html — the client will hydrate correctly
    html = `<div id="root"></div>`;
  }

  // Return additional routes on first call
  const links = url === '/en/' ? new Set(ROUTES) : undefined;

  return {
    html,
    links,
    head: {
      lang: url.startsWith('/es') ? 'es' : 'en',
    },
  };
}
