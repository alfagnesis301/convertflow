/**
 * Post-build prerender — runs after `vite build` and produces a static HTML
 * file per important route under dist/client/<route>/index.html.
 *
 * Each generated file contains:
 *   - Route-specific <title>, <meta description>, canonical, hreflang, OpenGraph
 *   - Pre-rendered visible content inside <div id="root"> (h1, intro,
 *     use cases, FAQs) so Google indexes the page instantly without
 *     waiting for React to hydrate
 *   - JSON-LD structured data (FAQPage, HowTo) for rich results
 *
 * Run with:  tsx scripts/prerender.mts
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// Import via namespace then unwrap — tsx loads source TS as CJS in this project
// (no "type": "module" in package.json) so named exports come through as a
// `default` object rather than top-level bindings.
import * as toolsConfigMod from '../src/lib/toolsConfig.ts';
import * as toolSeoMod from '../src/lib/toolSeoContent.ts';
import enLocale from '../src/locales/en.json' with { type: 'json' };
import esLocale from '../src/locales/es.json' with { type: 'json' };

type ToolsConfigModule = typeof import('../src/lib/toolsConfig');
type ToolSeoModule = typeof import('../src/lib/toolSeoContent');

const toolsConfig = ((toolsConfigMod as unknown as { default?: ToolsConfigModule }).default
  ?? (toolsConfigMod as unknown as ToolsConfigModule));
const toolSeo = ((toolSeoMod as unknown as { default?: ToolSeoModule }).default
  ?? (toolSeoMod as unknown as ToolSeoModule));

const { tools } = toolsConfig;
const { toolSeoContent, getToolSeoContent } = toolSeo;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist', 'client');
const TEMPLATE_PATH = path.join(DIST, 'index.html');
const SITE = 'https://flowtopdf.com';

type Lang = 'en' | 'es';

interface RouteMeta {
  /** Path under DIST where the index.html should be written, without leading slash. */
  out: string;
  /** Public URL path, e.g. "/en/pdf-to-word" (used for canonical & og:url) */
  url: string;
  lang: Lang;
  /** Localised counterpart URL for hreflang */
  alternate: { en: string; es: string };
  title: string;
  description: string;
  /** Pre-rendered HTML body that goes inside <div id="root"> */
  body: string;
  /** Optional JSON-LD blocks (raw JSON strings) to inject into <head> */
  jsonLd?: string[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(s: string): string {
  return escapeHtml(s);
}

function truncateForMeta(s: string, max: number): string {
  if (s.length <= max) return s;
  const slice = s.slice(0, max);
  const lastSpace = slice.lastIndexOf(' ');
  return (lastSpace > max * 0.6 ? slice.slice(0, lastSpace) : slice).replace(/[,;:.\s]+$/, '') + '…';
}

function siteHeader(lang: Lang): string {
  const homeHref = lang === 'en' ? '/en/' : '/es/';
  const navTools = lang === 'en' ? 'Tools' : 'Herramientas';
  const navBlog = 'Blog';
  const navAbout = lang === 'en' ? 'About' : 'Nosotros';
  const navContact = lang === 'en' ? 'Contact' : 'Contacto';
  return `<header style="padding:1rem 1.5rem;border-bottom:1px solid #eee;font-family:Inter,system-ui,sans-serif;display:flex;align-items:center;justify-content:space-between;max-width:1200px;margin:0 auto">
  <a href="${homeHref}" style="font-size:1.25rem;font-weight:700;color:#3B82F6;text-decoration:none">FlowToPDF</a>
  <nav style="display:flex;gap:1.5rem;font-size:0.95rem">
    <a href="${homeHref}" style="color:#374151;text-decoration:none">${navTools}</a>
    <a href="/${lang}/blog" style="color:#374151;text-decoration:none">${navBlog}</a>
    <a href="/${lang}/${lang === 'en' ? 'about' : 'sobre-nosotros'}" style="color:#374151;text-decoration:none">${navAbout}</a>
    <a href="/${lang}/${lang === 'en' ? 'contact' : 'contacto'}" style="color:#374151;text-decoration:none">${navContact}</a>
  </nav>
</header>`;
}

function siteFooter(lang: Lang): string {
  const en = lang === 'en';
  return `<footer style="margin-top:4rem;padding:2rem 1.5rem;border-top:1px solid #eee;background:#f9fafb;font-family:Inter,system-ui,sans-serif;font-size:0.9rem;color:#6b7280">
  <div style="max-width:1200px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:2rem">
    <div>
      <h3 style="color:#1f2937;font-weight:600;margin:0 0 0.75rem">${en ? 'PDF Tools' : 'Herramientas PDF'}</h3>
      <ul style="list-style:none;padding:0;margin:0;line-height:1.9">
        <li><a href="/${lang}/${en ? 'merge-pdf' : 'unir-pdf'}" style="color:#4b5563;text-decoration:none">${en ? 'Merge PDF' : 'Unir PDF'}</a></li>
        <li><a href="/${lang}/${en ? 'split-pdf' : 'dividir-pdf'}" style="color:#4b5563;text-decoration:none">${en ? 'Split PDF' : 'Dividir PDF'}</a></li>
        <li><a href="/${lang}/${en ? 'compress-pdf' : 'comprimir-pdf'}" style="color:#4b5563;text-decoration:none">${en ? 'Compress PDF' : 'Comprimir PDF'}</a></li>
        <li><a href="/${lang}/${en ? 'rotate-pdf' : 'rotar-pdf'}" style="color:#4b5563;text-decoration:none">${en ? 'Rotate PDF' : 'Rotar PDF'}</a></li>
      </ul>
    </div>
    <div>
      <h3 style="color:#1f2937;font-weight:600;margin:0 0 0.75rem">${en ? 'Convert' : 'Convertir'}</h3>
      <ul style="list-style:none;padding:0;margin:0;line-height:1.9">
        <li><a href="/${lang}/${en ? 'pdf-to-word' : 'pdf-a-word'}" style="color:#4b5563;text-decoration:none">${en ? 'PDF to Word' : 'PDF a Word'}</a></li>
        <li><a href="/${lang}/${en ? 'word-to-pdf' : 'word-a-pdf'}" style="color:#4b5563;text-decoration:none">${en ? 'Word to PDF' : 'Word a PDF'}</a></li>
        <li><a href="/${lang}/${en ? 'jpg-to-pdf' : 'jpg-a-pdf'}" style="color:#4b5563;text-decoration:none">${en ? 'JPG to PDF' : 'JPG a PDF'}</a></li>
        <li><a href="/${lang}/${en ? 'pdf-to-jpg' : 'pdf-a-jpg'}" style="color:#4b5563;text-decoration:none">${en ? 'PDF to JPG' : 'PDF a JPG'}</a></li>
      </ul>
    </div>
    <div>
      <h3 style="color:#1f2937;font-weight:600;margin:0 0 0.75rem">${en ? 'Company' : 'Empresa'}</h3>
      <ul style="list-style:none;padding:0;margin:0;line-height:1.9">
        <li><a href="/${lang}/${en ? 'about' : 'sobre-nosotros'}" style="color:#4b5563;text-decoration:none">${en ? 'About Us' : 'Nosotros'}</a></li>
        <li><a href="/${lang}/${en ? 'contact' : 'contacto'}" style="color:#4b5563;text-decoration:none">${en ? 'Contact' : 'Contacto'}</a></li>
        <li><a href="/${lang}/blog" style="color:#4b5563;text-decoration:none">Blog</a></li>
        <li><a href="/${lang}/${en ? 'privacy' : 'privacidad'}" style="color:#4b5563;text-decoration:none">${en ? 'Privacy' : 'Privacidad'}</a></li>
        <li><a href="/${lang}/${en ? 'terms' : 'terminos'}" style="color:#4b5563;text-decoration:none">${en ? 'Terms' : 'Términos'}</a></li>
      </ul>
    </div>
  </div>
  <p style="text-align:center;margin-top:2rem;color:#9ca3af">© 2026 FlowToPDF. ${en ? 'All rights reserved.' : 'Todos los derechos reservados.'}</p>
</footer>`;
}

// ─── Tool page body ───────────────────────────────────────────────────────

function buildToolBody(toolId: string, lang: Lang): string {
  const tool = tools.find((t) => t.id === toolId);
  if (!tool) return '';
  const localeBundle = (lang === 'en' ? enLocale : esLocale) as Record<string, unknown>;
  const toolsBundle = (localeBundle.tools as Record<string, { name?: string; desc?: string }>) ?? {};
  const toolBundle = toolsBundle[toolId] ?? {};
  const name = toolBundle.name ?? toolId;
  const desc = toolBundle.desc ?? '';
  const seo = getToolSeoContent(toolId, lang);

  const en = lang === 'en';
  const breadcrumbHome = en ? 'FlowToPDF' : 'FlowToPDF';

  let useCasesHtml = '';
  if (seo?.useCases?.length) {
    useCasesHtml = `<section style="margin-top:3rem">
      <h2 style="font-size:1.5rem;font-weight:700;color:#111827;margin:0 0 1rem">${en ? 'Common Use Cases' : 'Casos de uso habituales'}</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1rem">
        ${seo.useCases.map((uc, i) => `
          <div style="display:flex;gap:0.75rem;padding:1rem;background:white;border:1px solid #f3f4f6;border-radius:0.75rem">
            <span style="flex-shrink:0;width:1.5rem;height:1.5rem;border-radius:9999px;background:#dbeafe;color:#2563eb;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700">${i + 1}</span>
            <div>
              <p style="font-weight:600;color:#111827;font-size:0.875rem;margin:0 0 0.25rem">${escapeHtml(uc.title)}</p>
              <p style="font-size:0.75rem;color:#6b7280;line-height:1.5;margin:0">${escapeHtml(uc.description)}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </section>`;
  }

  let faqsHtml = '';
  if (seo?.faqs?.length) {
    faqsHtml = `<section style="margin-top:3rem">
      <h2 style="font-size:1.5rem;font-weight:700;color:#111827;margin:0 0 1rem">${en ? 'Frequently Asked Questions' : 'Preguntas frecuentes'}</h2>
      <div style="display:flex;flex-direction:column;gap:0.75rem">
        ${seo.faqs.map((faq) => `
          <details style="padding:1rem;background:white;border:1px solid #f3f4f6;border-radius:0.75rem">
            <summary style="font-weight:600;color:#111827;font-size:0.95rem;cursor:pointer">${escapeHtml(faq.question)}</summary>
            <p style="margin:0.75rem 0 0;color:#4b5563;font-size:0.875rem;line-height:1.6">${escapeHtml(faq.answer)}</p>
          </details>
        `).join('')}
      </div>
    </section>`;
  }

  const limitationsHtml = seo?.limitations
    ? `<aside style="margin-top:1.5rem;padding:1rem;background:#f9fafb;border:1px solid #e5e7eb;border-radius:0.75rem;font-size:0.875rem;color:#4b5563"><strong style="color:#374151">${en ? 'Limitations: ' : 'Limitaciones: '}</strong>${escapeHtml(seo.limitations)}</aside>`
    : '';

  const stepsHtml = `<section style="margin-top:3rem">
    <h2 style="font-size:1.5rem;font-weight:700;color:#111827;margin:0 0 1rem">${en ? `How to use ${name}` : `Cómo usar ${name}`}</h2>
    <ol style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem;list-style:none;padding:0;margin:0">
      <li style="padding:1rem;background:white;border:1px solid #f3f4f6;border-radius:0.75rem"><strong style="display:block;margin-bottom:0.25rem;color:#111827">1. ${en ? 'Upload your file' : 'Sube tu archivo'}</strong><span style="font-size:0.875rem;color:#6b7280">${en ? 'Click the upload area or drag your file in.' : 'Haz clic en el área de subida o arrastra el archivo.'}</span></li>
      <li style="padding:1rem;background:white;border:1px solid #f3f4f6;border-radius:0.75rem"><strong style="display:block;margin-bottom:0.25rem;color:#111827">2. ${en ? 'Configure options' : 'Configura las opciones'}</strong><span style="font-size:0.875rem;color:#6b7280">${en ? 'Adjust any settings to customise the output.' : 'Ajusta cualquier opción para personalizar el resultado.'}</span></li>
      <li style="padding:1rem;background:white;border:1px solid #f3f4f6;border-radius:0.75rem"><strong style="display:block;margin-bottom:0.25rem;color:#111827">3. ${en ? 'Download instantly' : 'Descarga al instante'}</strong><span style="font-size:0.875rem;color:#6b7280">${en ? 'Click Convert and the file is ready in seconds.' : 'Haz clic en Convertir y el archivo estará listo en segundos.'}</span></li>
    </ol>
  </section>`;

  return `${siteHeader(lang)}
<main style="max-width:1024px;margin:0 auto;padding:2.5rem 1.5rem;font-family:Inter,system-ui,sans-serif;color:#1f2937">
  <nav aria-label="Breadcrumb" style="font-size:0.875rem;color:#6b7280;margin-bottom:1rem">
    <a href="/${lang}/" style="color:#3B82F6;text-decoration:none">${breadcrumbHome}</a> &rsaquo; <span>${escapeHtml(name)}</span>
  </nav>
  <h1 style="font-size:2.25rem;font-weight:700;line-height:1.15;margin:0 0 0.75rem;color:#111827">${escapeHtml(name)}</h1>
  <p style="font-size:1.125rem;color:#4b5563;margin:0 0 1rem">${escapeHtml(desc)}</p>
  ${seo?.intro ? `<p style="font-size:1rem;color:#6b7280;line-height:1.65;margin:0 0 2rem">${escapeHtml(seo.intro)}</p>` : ''}
  <p style="font-size:0.875rem;color:#3B82F6;font-style:italic">${en ? 'Loading the interactive uploader…' : 'Cargando el cargador interactivo…'}</p>
  ${stepsHtml}
  ${useCasesHtml}
  ${faqsHtml}
  ${limitationsHtml}
</main>
${siteFooter(lang)}`;
}

// ─── JSON-LD builders ─────────────────────────────────────────────────────

function faqJsonLd(faqs: { question: string; answer: string }[]): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  });
}

function howToJsonLd(name: string, lang: Lang): string {
  const en = lang === 'en';
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: en ? `How to use ${name}` : `Cómo usar ${name}`,
    step: [
      { '@type': 'HowToStep', position: 1, name: en ? 'Upload your file' : 'Sube tu archivo' },
      { '@type': 'HowToStep', position: 2, name: en ? 'Configure options' : 'Configura las opciones' },
      { '@type': 'HowToStep', position: 3, name: en ? 'Download instantly' : 'Descarga al instante' },
    ],
  });
}

// ─── Build the route list ─────────────────────────────────────────────────

function buildRoutes(): RouteMeta[] {
  const out: RouteMeta[] = [];

  // Home pages
  for (const lang of ['en', 'es'] as const) {
    const en = lang === 'en';
    out.push({
      out: `${lang}/index.html`,
      url: `/${lang}/`,
      lang,
      alternate: { en: '/en/', es: '/es/' },
      title: en
        ? 'FlowToPDF — Free Online PDF Tools'
        : 'FlowToPDF — Herramientas PDF gratuitas online',
      description: en
        ? 'Free online PDF tools — convert, merge, split, compress, rotate and edit PDF files instantly. No registration required. Fast, secure, easy.'
        : 'Herramientas PDF gratuitas online: convierte, une, divide, comprime, rota y edita PDFs al instante. Sin registro. Rápido, seguro y fácil.',
      body: `${siteHeader(lang)}
<main style="max-width:1024px;margin:0 auto;padding:3rem 1.5rem;font-family:Inter,system-ui,sans-serif;color:#1f2937;text-align:center">
  <h1 style="font-size:2.5rem;font-weight:800;line-height:1.15;margin:0 0 1rem;color:#111827">${en ? 'Free and Easy PDF Tools Online' : 'Herramientas PDF gratuitas y fáciles online'}</h1>
  <p style="font-size:1.125rem;color:#4b5563;max-width:640px;margin:0 auto 2.5rem">${en ? 'Convert, merge, split, compress and edit PDF files online. No installation needed, no sign-up required. Fast, secure, and free.' : 'Convierte, une, divide, comprime y edita archivos PDF online. Sin instalación, sin registro. Rápido, seguro y gratis.'}</p>
  <section style="margin-top:3rem;text-align:left">
    <h2 style="font-size:1.5rem;font-weight:700;color:#111827;margin:0 0 1rem">${en ? 'Popular Tools' : 'Herramientas populares'}</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem">
      ${(['pdf-to-word','merge-pdf','compress-pdf','jpg-to-pdf','pdf-to-jpg','split-pdf','rotate-pdf','word-to-pdf'] as const).map((id) => {
        const t = tools.find((tt) => tt.id === id);
        if (!t) return '';
        const slug = t.slug[lang];
        const tBundle = ((lang === 'en' ? enLocale : esLocale) as Record<string, unknown>).tools as Record<string, { name?: string; desc?: string }>;
        const n = tBundle[id]?.name ?? id;
        const d = tBundle[id]?.desc ?? '';
        return `<a href="/${lang}/${slug}" style="display:block;padding:1.25rem;background:white;border:1px solid #f3f4f6;border-radius:0.75rem;text-decoration:none;color:inherit"><strong style="display:block;color:#111827;margin-bottom:0.25rem">${escapeHtml(n)}</strong><span style="font-size:0.875rem;color:#6b7280">${escapeHtml(d)}</span></a>`;
      }).join('')}
    </div>
  </section>
</main>
${siteFooter(lang)}`,
    });
  }

  // Tool pages — only the tools that have rich SEO content
  for (const toolId of Object.keys(toolSeoContent)) {
    const tool = tools.find((t) => t.id === toolId);
    if (!tool) continue;
    for (const lang of ['en', 'es'] as const) {
      const slug = tool.slug[lang];
      const localeBundle = (lang === 'en' ? enLocale : esLocale) as Record<string, unknown>;
      const toolsBundle = (localeBundle.tools as Record<string, { name?: string; desc?: string }>) ?? {};
      const name = toolsBundle[toolId]?.name ?? toolId;
      const desc = toolsBundle[toolId]?.desc ?? '';
      const seo = getToolSeoContent(toolId, lang);
      const enSlug = tool.slug.en;
      const esSlug = tool.slug.es;
      out.push({
        out: `${lang}/${slug}/index.html`,
        url: `/${lang}/${slug}`,
        lang,
        alternate: { en: `/en/${enSlug}`, es: `/es/${esSlug}` },
        title: lang === 'en'
          ? `${name} — Free Online PDF Tool | FlowToPDF`
          : `${name} — Herramienta PDF gratuita | FlowToPDF`,
        description: truncateForMeta(seo?.intro ?? desc, 160),
        body: buildToolBody(toolId, lang),
        jsonLd: [
          ...(seo?.faqs?.length ? [faqJsonLd(seo.faqs)] : []),
          howToJsonLd(name, lang),
        ],
      });
    }
  }

  // Static pages: about, contact, privacy, terms
  const staticPages: { id: string; en: string; es: string; titleEn: string; titleEs: string; descEn: string; descEs: string; bodyEn: string; bodyEs: string }[] = [
    {
      id: 'about',
      en: 'about',
      es: 'sobre-nosotros',
      titleEn: 'About FlowToPDF | Free PDF Tools Online',
      titleEs: 'Sobre FlowToPDF | Herramientas PDF gratuitas',
      descEn: 'FlowToPDF is a free, browser-based toolkit for working with PDF files. Privacy-first, no account required.',
      descEs: 'FlowToPDF es un conjunto gratuito de herramientas PDF en el navegador. Privacidad primero, sin cuenta.',
      bodyEn: '<h1>About FlowToPDF</h1><p>FlowToPDF is a free, browser-based toolkit for working with PDF files. We built it because most PDF tools are either expensive, require an account, or fill the page with ads. We wanted something simpler.</p><h2>Our Mission</h2><p>Make professional-grade document tools freely available to everyone — no subscriptions, no account required, no watermarks.</p>',
      bodyEs: '<h1>Sobre FlowToPDF</h1><p>FlowToPDF es un conjunto gratuito de herramientas PDF en el navegador. Lo construimos porque la mayoría son caras, exigen cuenta o llenan la página de anuncios. Queríamos algo más simple.</p><h2>Nuestra misión</h2><p>Que las herramientas de documentos de calidad profesional estén al alcance de todos — sin suscripciones, sin cuenta, sin marcas de agua.</p>',
    },
    {
      id: 'contact',
      en: 'contact',
      es: 'contacto',
      titleEn: 'Contact Us | FlowToPDF',
      titleEs: 'Contacto | FlowToPDF',
      descEn: 'Have a question or feedback? Email support@flowtopdf.com or use the contact form.',
      descEs: '¿Una pregunta o sugerencia? Escribe a support@flowtopdf.com o usa el formulario.',
      bodyEn: '<h1>Contact Us</h1><p>Have a question, feedback, or need help? Email <a href="mailto:support@flowtopdf.com">support@flowtopdf.com</a> or fill in the form below.</p>',
      bodyEs: '<h1>Contacto</h1><p>¿Una pregunta, sugerencia o necesitas ayuda? Escríbenos a <a href="mailto:support@flowtopdf.com">support@flowtopdf.com</a> o usa el formulario.</p>',
    },
    {
      id: 'privacy',
      en: 'privacy',
      es: 'privacidad',
      titleEn: 'Privacy Policy | FlowToPDF',
      titleEs: 'Política de Privacidad | FlowToPDF',
      descEn: 'Learn how FlowToPDF handles your files. Files deleted within 30 minutes, never read by humans.',
      descEs: 'Cómo FlowToPDF gestiona tus archivos. Borrado en 30 minutos, nunca leídos por humanos.',
      bodyEn: '<h1>Privacy Policy</h1><p>FlowToPDF takes your privacy seriously. Files you upload are processed in a temporary directory, never read by humans, and automatically deleted within 30 minutes. We do not collect personal data.</p>',
      bodyEs: '<h1>Política de Privacidad</h1><p>FlowToPDF se toma en serio tu privacidad. Los archivos que subes se procesan en un directorio temporal, nunca son leídos por personas y se eliminan automáticamente en 30 minutos. No recopilamos datos personales.</p>',
    },
    {
      id: 'terms',
      en: 'terms',
      es: 'terminos',
      titleEn: 'Terms of Service | FlowToPDF',
      titleEs: 'Términos de servicio | FlowToPDF',
      descEn: 'Terms of service for using FlowToPDF\'s free online PDF tools.',
      descEs: 'Términos de servicio para usar las herramientas PDF gratuitas de FlowToPDF.',
      bodyEn: '<h1>Terms of Service</h1><p>By using FlowToPDF, you agree to these terms. Do not upload illegal content. We provide the service "as is" without warranties.</p>',
      bodyEs: '<h1>Términos de servicio</h1><p>Al usar FlowToPDF aceptas estos términos. No subas contenido ilegal. Prestamos el servicio "tal cual", sin garantías.</p>',
    },
  ];

  for (const page of staticPages) {
    for (const lang of ['en', 'es'] as const) {
      const en = lang === 'en';
      const slug = en ? page.en : page.es;
      out.push({
        out: `${lang}/${slug}/index.html`,
        url: `/${lang}/${slug}`,
        lang,
        alternate: { en: `/en/${page.en}`, es: `/es/${page.es}` },
        title: en ? page.titleEn : page.titleEs,
        description: en ? page.descEn : page.descEs,
        body: `${siteHeader(lang)}<main style="max-width:768px;margin:0 auto;padding:2.5rem 1.5rem;font-family:Inter,system-ui,sans-serif;color:#1f2937;line-height:1.6">${en ? page.bodyEn : page.bodyEs}</main>${siteFooter(lang)}`,
      });
    }
  }

  // Category pages
  const categories: { id: string; en: string; es: string; nameEn: string; nameEs: string; descEn: string; descEs: string }[] = [
    { id: 'pdf-converter', en: 'pdf-converter', es: 'convertidor-pdf', nameEn: 'PDF Converter Tools', nameEs: 'Herramientas Convertidor PDF', descEn: 'Convert PDF to Word, JPG, PNG, text and more. Convert other formats to PDF.', descEs: 'Convierte PDF a Word, JPG, PNG, texto y más. Convierte otros formatos a PDF.' },
    { id: 'image-to-pdf', en: 'image-to-pdf', es: 'imagen-a-pdf', nameEn: 'Image to PDF Tools', nameEs: 'Herramientas Imagen a PDF', descEn: 'Convert JPG, PNG, WebP, GIF, SVG images into a single PDF document.', descEs: 'Convierte imágenes JPG, PNG, WebP, GIF y SVG a un único PDF.' },
    { id: 'pdf-tools', en: 'pdf-tools', es: 'herramientas-pdf', nameEn: 'PDF Editing Tools', nameEs: 'Herramientas de edición PDF', descEn: 'Merge, split, compress, rotate, protect, unlock, reorder PDFs and more.', descEs: 'Une, divide, comprime, rota, protege, desbloquea y reordena PDFs.' },
    { id: 'office-to-pdf', en: 'office-to-pdf', es: 'office-a-pdf', nameEn: 'Office to PDF Tools', nameEs: 'Herramientas Office a PDF', descEn: 'Convert Word, Excel, PowerPoint, ODT, RTF documents into PDFs.', descEs: 'Convierte documentos Word, Excel, PowerPoint, ODT y RTF a PDF.' },
  ];
  for (const c of categories) {
    for (const lang of ['en', 'es'] as const) {
      const en = lang === 'en';
      const slug = en ? c.en : c.es;
      const name = en ? c.nameEn : c.nameEs;
      const desc = en ? c.descEn : c.descEs;
      // List tools that belong to this category
      const catTools = tools.filter((t) => t.category === c.id);
      const localeBundle = (lang === 'en' ? enLocale : esLocale) as Record<string, unknown>;
      const tBundle = (localeBundle.tools as Record<string, { name?: string; desc?: string }>) ?? {};
      const toolsHtml = catTools.map((t) => {
        const n = tBundle[t.id]?.name ?? t.id;
        const d = tBundle[t.id]?.desc ?? '';
        return `<li style="padding:1rem;background:white;border:1px solid #f3f4f6;border-radius:0.75rem"><a href="/${lang}/${t.slug[lang]}" style="text-decoration:none;color:inherit"><strong style="display:block;color:#111827;margin-bottom:0.25rem">${escapeHtml(n)}</strong><span style="font-size:0.875rem;color:#6b7280">${escapeHtml(d)}</span></a></li>`;
      }).join('');
      out.push({
        out: `${lang}/${slug}/index.html`,
        url: `/${lang}/${slug}`,
        lang,
        alternate: { en: `/en/${c.en}`, es: `/es/${c.es}` },
        title: `${name} | FlowToPDF`,
        description: desc,
        body: `${siteHeader(lang)}<main style="max-width:1024px;margin:0 auto;padding:2.5rem 1.5rem;font-family:Inter,system-ui,sans-serif;color:#1f2937">
          <h1 style="font-size:2rem;font-weight:700;color:#111827;margin:0 0 0.75rem">${escapeHtml(name)}</h1>
          <p style="font-size:1.125rem;color:#4b5563;margin:0 0 2rem">${escapeHtml(desc)}</p>
          <ul style="list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1rem">${toolsHtml}</ul>
        </main>${siteFooter(lang)}`,
      });
    }
  }

  return out;
}

// ─── HTML rewriter ────────────────────────────────────────────────────────

function rewriteHtml(template: string, route: RouteMeta): string {
  const enUrl = `${SITE}${route.alternate.en}`;
  const esUrl = `${SITE}${route.alternate.es}`;
  const canonical = `${SITE}${route.url}`;

  // Inject prerendered body into <div id="root"> — replace whatever is inside
  // the root div (the existing SEO fallback) with our route-specific body.
  // The match runs until the closing </div> immediately before </body>.
  const rootMatch = template.match(/<div id="root">([\s\S]*?)<\/div>(\s*<\/body>)/);
  if (!rootMatch) {
    throw new Error('Could not locate <div id="root">…</div></body> in template');
  }
  let html = template.replace(rootMatch[0], `<div id="root">${route.body}</div>${rootMatch[2]}`);

  // Replace title
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(route.title)}</title>`);

  // Replace meta description
  html = html.replace(
    /<meta name="description" content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${escapeAttr(route.description)}" />`,
  );

  // Replace OG/Twitter title and description
  html = html.replace(/<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${escapeAttr(route.title)}" />`);
  html = html.replace(/<meta property="og:description" content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${escapeAttr(route.description)}" />`);
  html = html.replace(/<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${escapeAttr(canonical)}" />`);
  html = html.replace(/<meta name="twitter:title" content="[^"]*"\s*\/?>/, `<meta name="twitter:title" content="${escapeAttr(route.title)}" />`);
  html = html.replace(/<meta name="twitter:description" content="[^"]*"\s*\/?>/, `<meta name="twitter:description" content="${escapeAttr(route.description)}" />`);

  // Replace canonical and hreflang links
  html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${escapeAttr(canonical)}" />`);
  html = html.replace(/<link rel="alternate" hreflang="en" href="[^"]*"\s*\/?>/, `<link rel="alternate" hreflang="en" href="${escapeAttr(enUrl)}" />`);
  html = html.replace(/<link rel="alternate" hreflang="es" href="[^"]*"\s*\/?>/, `<link rel="alternate" hreflang="es" href="${escapeAttr(esUrl)}" />`);

  // Replace <html lang>
  html = html.replace(/<html lang="[^"]*"/, `<html lang="${route.lang}"`);

  // Inject extra JSON-LD before </head>
  if (route.jsonLd?.length) {
    const blocks = route.jsonLd.map((j) => `<script type="application/ld+json">${j}</script>`).join('\n    ');
    html = html.replace('</head>', `    ${blocks}\n  </head>`);
  }

  return html;
}

// ─── Main ─────────────────────────────────────────────────────────────────

function main(): void {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error(`[prerender] template not found at ${TEMPLATE_PATH} — did you run vite build?`);
    process.exit(1);
  }
  const template = fs.readFileSync(TEMPLATE_PATH, 'utf-8');
  const routes = buildRoutes();

  let written = 0;
  for (const route of routes) {
    const outPath = path.join(DIST, route.out);
    const outDir = path.dirname(outPath);
    fs.mkdirSync(outDir, { recursive: true });
    const html = rewriteHtml(template, route);
    fs.writeFileSync(outPath, html, 'utf-8');
    written++;
  }
  console.log(`[prerender] wrote ${written} static HTML files for ${routes.length} routes`);
}

main();
