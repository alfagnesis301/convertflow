/**
 * Post-build SEO prerender.
 *
 * Vite builds the interactive React app, then this script writes one complete
 * static HTML file for every indexable route. Bots get route-specific content
 * immediately; the uploader and other interactive UI hydrate afterwards.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as toolsConfigMod from '../src/lib/toolsConfig.ts';
import * as toolSeoMod from '../src/lib/toolSeoContent.ts';
import * as blogEnMod from '../src/content/blog.en.ts';
import * as blogEsMod from '../src/content/blog.es.ts';
import enLocale from '../src/locales/en.json' with { type: 'json' };
import esLocale from '../src/locales/es.json' with { type: 'json' };

type ToolsConfigModule = typeof import('../src/lib/toolsConfig');
type ToolSeoModule = typeof import('../src/lib/toolSeoContent');
type BlogModule = typeof import('../src/content/blog.en');
type Lang = 'en' | 'es';

interface RouteMeta {
  out: string;
  url: string;
  lang: Lang;
  alternate: { en: string; es: string };
  title: string;
  description: string;
  body: string;
  jsonLd?: string[];
  changefreq?: 'weekly' | 'monthly' | 'yearly';
  priority?: string;
}

interface SeoSection {
  intro: string;
  useCases: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  limitations: string;
}

const toolsConfig = ((toolsConfigMod as unknown as { default?: ToolsConfigModule }).default
  ?? (toolsConfigMod as unknown as ToolsConfigModule));
const toolSeo = ((toolSeoMod as unknown as { default?: ToolSeoModule }).default
  ?? (toolSeoMod as unknown as ToolSeoModule));
const blogEn = ((blogEnMod as unknown as { default?: BlogModule }).default
  ?? (blogEnMod as unknown as BlogModule));
const blogEs = ((blogEsMod as unknown as { default?: BlogModule }).default
  ?? (blogEsMod as unknown as BlogModule));

const { tools, categories } = toolsConfig;
const { getToolSeoContent } = toolSeo;
const blogPostsEn = blogEn.blogPostsEn ?? [];
const blogPostsEs = blogEs.blogPostsEs ?? [];

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist', 'client');
const PUBLIC = path.join(ROOT, 'public');
const TEMPLATE_PATH = path.join(DIST, 'index.html');
const SITE = 'https://flowtopdf.com';
const LASTMOD = new Date().toISOString().slice(0, 10);

const localeByLang = {
  en: enLocale as Record<string, unknown>,
  es: esLocale as Record<string, unknown>,
};

function withSlash(urlPath: string): string {
  if (urlPath === '/') return '/';
  return urlPath.endsWith('/') ? urlPath : `${urlPath}/`;
}

function abs(urlPath: string): string {
  return `${SITE}${withSlash(urlPath)}`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function stripMarkdown(s: string): string {
  return s
    .replace(/[#*_`>-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function metaDescription(text: string): string {
  const clean = stripMarkdown(text);
  if (clean.length <= 160) return clean;
  const slice = clean.slice(0, 157);
  const lastSpace = slice.lastIndexOf(' ');
  return `${slice.slice(0, lastSpace > 100 ? lastSpace : 157).replace(/[.,;:\s]+$/, '')}...`;
}

function localeTool(toolId: string, lang: Lang): { name: string; desc: string; longDesc?: string; limitations?: string; useCases?: string[]; faqs?: { q: string; a: string }[] } {
  const bundle = ((localeByLang[lang].tools as Record<string, unknown>) ?? {})[toolId] as Record<string, unknown> | undefined;
  return {
    name: String(bundle?.name ?? toolId),
    desc: String(bundle?.desc ?? ''),
    longDesc: typeof bundle?.longDesc === 'string' ? bundle.longDesc : undefined,
    limitations: typeof bundle?.limitations === 'string' ? bundle.limitations : undefined,
    useCases: Array.isArray(bundle?.useCases) ? bundle.useCases as string[] : undefined,
    faqs: Array.isArray(bundle?.faqs) ? bundle.faqs as { q: string; a: string }[] : undefined,
  };
}

function seoForTool(toolId: string, lang: Lang): SeoSection {
  const rich = getToolSeoContent(toolId, lang);
  const locale = localeTool(toolId, lang);
  if (rich) {
    return {
      intro: rich.intro,
      useCases: rich.useCases,
      faqs: rich.faqs,
      limitations: rich.limitations ?? (lang === 'en'
        ? 'Conversion results can vary depending on the structure, quality and complexity of the source file.'
        : 'Los resultados pueden variar segun la estructura, calidad y complejidad del archivo original.'),
    };
  }

  const en = lang === 'en';
  return {
    intro: locale.longDesc ?? (en
      ? `${locale.name} helps you process files directly in your browser with clear output, no account required and automatic file cleanup after conversion.`
      : `${locale.name} te ayuda a procesar archivos directamente en el navegador, sin cuenta y con eliminacion automatica tras la conversion.`),
    useCases: locale.useCases?.map((item) => ({ title: item, description: en ? `Use ${locale.name} when you need a fast online PDF workflow without installing desktop software.` : `Usa ${locale.name} cuando necesites una herramienta PDF online rapida sin instalar software.` })) ?? [
      { title: en ? 'Prepare files for sharing' : 'Preparar archivos para compartir', description: en ? 'Create a cleaner document for email, portals or internal review.' : 'Crea un documento mas limpio para correo, portales o revision interna.' },
      { title: en ? 'Work from any device' : 'Trabajar desde cualquier dispositivo', description: en ? 'Run the conversion from a desktop, tablet or phone browser.' : 'Ejecuta la conversion desde navegador de escritorio, tablet o movil.' },
      { title: en ? 'Keep documents organised' : 'Mantener documentos organizados', description: en ? 'Standardise files into PDF-friendly workflows for archiving.' : 'Estandariza archivos para flujos de archivo y consulta en PDF.' },
    ],
    faqs: locale.faqs?.map((faq) => ({ question: faq.q, answer: faq.a })) ?? [
      { question: en ? `Is ${locale.name} free?` : `Es gratis ${locale.name}?`, answer: en ? 'Yes. FlowToPDF tools are free to use and do not require registration.' : 'Si. Las herramientas de FlowToPDF son gratuitas y no requieren registro.' },
      { question: en ? 'Are my files private?' : 'Mis archivos son privados?', answer: en ? 'Files are transferred over HTTPS, processed temporarily and deleted automatically within 30 minutes.' : 'Los archivos se transfieren por HTTPS, se procesan temporalmente y se eliminan automaticamente en 30 minutos.' },
      { question: en ? 'What is the upload limit?' : 'Cual es el limite de subida?', answer: en ? 'The current file size limit is 50 MB per upload.' : 'El limite actual es de 50 MB por subida.' },
    ],
    limitations: locale.limitations ?? (en
      ? 'Very large, damaged or password-protected files may need to be split, repaired or unlocked before processing.'
      : 'Los archivos muy grandes, danados o protegidos con contrasena pueden necesitar dividirse, repararse o desbloquearse antes.'),
  };
}

function siteHeader(lang: Lang): string {
  const en = lang === 'en';
  return `<header style="padding:1rem 1.5rem;border-bottom:1px solid #e5e7eb;font-family:Inter,system-ui,sans-serif">
  <div style="max-width:1120px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:1rem">
    <a href="/${lang}/" style="font-size:1.25rem;font-weight:800;color:#2563eb;text-decoration:none">FlowToPDF</a>
    <nav style="display:flex;gap:1rem;flex-wrap:wrap;font-size:0.95rem">
      <a href="/${lang}/${en ? 'pdf-tools' : 'herramientas-pdf'}/" style="color:#374151;text-decoration:none">${en ? 'PDF Tools' : 'Herramientas PDF'}</a>
      <a href="/${lang}/${en ? 'pdf-converter' : 'convertidor-pdf'}/" style="color:#374151;text-decoration:none">${en ? 'Converters' : 'Convertidores'}</a>
      <a href="/${lang}/blog/" style="color:#374151;text-decoration:none">Blog</a>
      <a href="/${lang}/${en ? 'contact' : 'contacto'}/" style="color:#374151;text-decoration:none">${en ? 'Contact' : 'Contacto'}</a>
    </nav>
  </div>
</header>`;
}

function siteFooter(lang: Lang): string {
  const en = lang === 'en';
  return `<footer style="margin-top:4rem;padding:2rem 1.5rem;border-top:1px solid #e5e7eb;background:#f9fafb;font-family:Inter,system-ui,sans-serif;font-size:0.9rem;color:#6b7280">
  <div style="max-width:1120px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:1.5rem">
    <div><strong style="display:block;color:#111827;margin-bottom:.5rem">${en ? 'Popular tools' : 'Herramientas populares'}</strong><a href="/${lang}/${en ? 'pdf-to-word' : 'pdf-a-word'}/">PDF to Word</a><br><a href="/${lang}/${en ? 'merge-pdf' : 'unir-pdf'}/">${en ? 'Merge PDF' : 'Unir PDF'}</a><br><a href="/${lang}/${en ? 'compress-pdf' : 'comprimir-pdf'}/">${en ? 'Compress PDF' : 'Comprimir PDF'}</a></div>
    <div><strong style="display:block;color:#111827;margin-bottom:.5rem">${en ? 'Converters' : 'Convertidores'}</strong><a href="/${lang}/${en ? 'word-to-pdf' : 'word-a-pdf'}/">Word to PDF</a><br><a href="/${lang}/${en ? 'jpg-to-pdf' : 'jpg-a-pdf'}/">JPG to PDF</a><br><a href="/${lang}/${en ? 'webp-to-pdf' : 'webp-a-pdf'}/">WebP to PDF</a></div>
    <div><strong style="display:block;color:#111827;margin-bottom:.5rem">${en ? 'Company' : 'Empresa'}</strong><a href="/${lang}/${en ? 'about' : 'sobre-nosotros'}/">${en ? 'About' : 'Nosotros'}</a><br><a href="/${lang}/${en ? 'privacy-policy' : 'politica-de-privacidad'}/">${en ? 'Privacy' : 'Privacidad'}</a><br><a href="/${lang}/${en ? 'terms' : 'terminos'}/">${en ? 'Terms' : 'Terminos'}</a></div>
  </div>
  <p style="max-width:1120px;margin:1.5rem auto 0;color:#9ca3af">© 2026 FlowToPDF. ${en ? 'All rights reserved.' : 'Todos los derechos reservados.'}</p>
</footer>`;
}

function homeBody(lang: Lang, root = false): string {
  const en = lang === 'en';
  const popular = ['pdf-to-word', 'word-to-pdf', 'jpg-to-pdf', 'webp-to-pdf', 'text-to-pdf', 'merge-pdf', 'split-pdf', 'compress-pdf', 'rotate-pdf', 'ocr-pdf'];
  return `${siteHeader(lang)}
<main style="max-width:1120px;margin:0 auto;padding:3rem 1.5rem;font-family:Inter,system-ui,sans-serif;color:#1f2937">
  <h1 style="font-size:2.5rem;line-height:1.15;margin:0 0 1rem;color:#111827">${en ? 'Free Online PDF Tools' : 'Herramientas PDF gratis online'}</h1>
  <p style="font-size:1.125rem;line-height:1.7;color:#4b5563;max-width:760px">${en ? 'Convert, merge, split, compress, rotate and OCR PDF files from your browser. Each indexable page includes real HTML content, clear instructions and privacy information before the interactive uploader loads.' : 'Convierte, une, divide, comprime, rota y aplica OCR a archivos PDF desde el navegador. Cada pagina indexable incluye contenido HTML real, instrucciones e informacion de privacidad antes de cargar el componente interactivo.'}</p>
  ${root ? `<p><a href="/en/">English</a> · <a href="/es/">Español</a></p>` : ''}
  <section style="margin-top:2.5rem"><h2>${en ? 'Popular tools' : 'Herramientas populares'}</h2><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem">
    ${popular.map((id) => {
      const tool = tools.find((t) => t.id === id);
      if (!tool) return '';
      const loc = localeTool(id, lang);
      return `<a href="/${lang}/${tool.slug[lang]}/" style="display:block;padding:1rem;border:1px solid #e5e7eb;border-radius:.5rem;text-decoration:none;color:inherit"><strong>${escapeHtml(loc.name)}</strong><br><span style="color:#6b7280;font-size:.9rem">${escapeHtml(loc.desc)}</span></a>`;
    }).join('')}
  </div></section>
  <section style="margin-top:2.5rem"><h2>${en ? 'Tool categories' : 'Categorias'}</h2><ul>
    <li><a href="/${lang}/${en ? 'pdf-converter' : 'convertidor-pdf'}/">${en ? 'PDF converter tools' : 'Convertidores PDF'}</a></li>
    <li><a href="/${lang}/${en ? 'image-to-pdf' : 'imagen-a-pdf'}/">${en ? 'Image to PDF tools' : 'Imagen a PDF'}</a></li>
    <li><a href="/${lang}/${en ? 'pdf-tools' : 'herramientas-pdf'}/">${en ? 'PDF editing tools' : 'Herramientas PDF'}</a></li>
    <li><a href="/${lang}/${en ? 'office-to-pdf' : 'office-a-pdf'}/">${en ? 'Office to PDF tools' : 'Office a PDF'}</a></li>
  </ul></section>
</main>${siteFooter(lang)}`;
}

function relatedToolLinks(toolId: string, lang: Lang): string {
  const tool = tools.find((t) => t.id === toolId);
  if (!tool) return '';
  const related = tools
    .filter((candidate) => candidate.available && candidate.id !== toolId && candidate.category === tool.category && candidate.id !== 'image-to-pdf')
    .slice(0, 6);
  return `<section style="margin-top:2.5rem"><h2>${lang === 'en' ? 'Related PDF tools' : 'Herramientas relacionadas'}</h2><ul>${related.map((candidate) => `<li><a href="/${lang}/${candidate.slug[lang]}/">${escapeHtml(localeTool(candidate.id, lang).name)}</a></li>`).join('')}</ul></section>`;
}

function toolBody(toolId: string, lang: Lang): string {
  const tool = tools.find((t) => t.id === toolId);
  const locale = localeTool(toolId, lang);
  const seo = seoForTool(toolId, lang);
  const en = lang === 'en';
  return `${siteHeader(lang)}
<main style="max-width:960px;margin:0 auto;padding:2.5rem 1.5rem;font-family:Inter,system-ui,sans-serif;color:#1f2937">
  <nav aria-label="Breadcrumb" style="font-size:.9rem;color:#6b7280;margin-bottom:1rem"><a href="/${lang}/">FlowToPDF</a> &gt; <a href="/${lang}/${en ? 'pdf-tools' : 'herramientas-pdf'}/">${en ? 'Tools' : 'Herramientas'}</a> &gt; <span>${escapeHtml(locale.name)}</span></nav>
  <h1 style="font-size:2.25rem;line-height:1.15;margin:0 0 .75rem;color:#111827">${escapeHtml(locale.name)}</h1>
  <p style="font-size:1.125rem;line-height:1.65;color:#4b5563">${escapeHtml(seo.intro)}</p>

  <section style="margin-top:2.5rem"><h2>${en ? `How to use ${locale.name}` : `Como usar ${locale.name}`}</h2><ol>
    <li>${en ? 'Upload your file using the secure uploader.' : 'Sube tu archivo con el cargador seguro.'}</li>
    <li>${en ? 'Choose any available conversion options, such as page size, margins, quality or language.' : 'Elige las opciones disponibles, como tamano de pagina, margenes, calidad o idioma.'}</li>
    <li>${en ? 'Start the conversion and download the finished file when it is ready.' : 'Inicia la conversion y descarga el archivo final cuando este listo.'}</li>
  </ol></section>

  <section style="margin-top:2.5rem"><h2>${en ? 'Common use cases' : 'Casos de uso'}</h2><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem">
    ${seo.useCases.map((uc) => `<article style="border:1px solid #e5e7eb;border-radius:.5rem;padding:1rem"><h3 style="font-size:1rem;margin:.1rem 0 .4rem;color:#111827">${escapeHtml(uc.title)}</h3><p style="margin:0;color:#6b7280;font-size:.92rem;line-height:1.55">${escapeHtml(uc.description)}</p></article>`).join('')}
  </div></section>

  <section style="margin-top:2.5rem"><h2>${en ? 'Limitations' : 'Limitaciones'}</h2><p>${escapeHtml(seo.limitations)}</p></section>
  <section style="margin-top:2.5rem"><h2>${en ? 'Privacy and security' : 'Privacidad y seguridad'}</h2><p>${en ? 'Files are transferred over HTTPS, processed only for the requested conversion and automatically deleted within 30 minutes. FlowToPDF does not require an account and does not use uploaded files for training or manual review.' : 'Los archivos se transfieren por HTTPS, se procesan solo para la conversion solicitada y se eliminan automaticamente en 30 minutos. FlowToPDF no requiere cuenta y no usa tus archivos para entrenamiento ni revision manual.'}</p></section>

  <section style="margin-top:2.5rem"><h2>${en ? 'Frequently asked questions' : 'Preguntas frecuentes'}</h2>
    ${seo.faqs.map((faq) => `<details style="border-bottom:1px solid #e5e7eb;padding:1rem 0"><summary style="font-weight:700;color:#111827">${escapeHtml(faq.question)}</summary><p style="color:#4b5563;line-height:1.6">${escapeHtml(faq.answer)}</p></details>`).join('')}
  </section>

  ${relatedToolLinks(toolId, lang)}

  <section id="converter" style="margin-top:3rem;padding:1rem;border:1px solid #dbeafe;background:#eff6ff;border-radius:.5rem">
    <h2>${en ? 'Convert your file' : 'Convierte tu archivo'}</h2>
    <p>${en ? 'The interactive uploader loads here in the browser after the SEO content.' : 'El cargador interactivo se carga aqui en el navegador despues del contenido SEO.'}</p>
  </section>
</main>${siteFooter(lang)}`;
}

function faqJsonLd(faqs: { question: string; answer: string }[]): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  });
}

function howToJsonLd(name: string, lang: Lang): string {
  const en = lang === 'en';
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: en ? `How to use ${name}` : `Como usar ${name}`,
    step: [
      { '@type': 'HowToStep', position: 1, name: en ? 'Upload your file' : 'Sube tu archivo' },
      { '@type': 'HowToStep', position: 2, name: en ? 'Choose options' : 'Elige opciones' },
      { '@type': 'HowToStep', position: 3, name: en ? 'Download the result' : 'Descarga el resultado' },
    ],
  });
}

function markdownToHtml(markdown: string): string {
  const lines = markdown.trim().split(/\r?\n/);
  let html = '';
  let listOpen = false;
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      if (listOpen) {
        html += '</ul>';
        listOpen = false;
      }
      continue;
    }
    if (line.startsWith('## ')) {
      if (listOpen) {
        html += '</ul>';
        listOpen = false;
      }
      html += `<h2>${escapeHtml(line.slice(3))}</h2>`;
    } else if (/^\d+\.\s/.test(line)) {
      if (listOpen) {
        html += '</ul>';
        listOpen = false;
      }
      html += `<p>${escapeHtml(line)}</p>`;
    } else if (line.startsWith('- ')) {
      if (!listOpen) {
        html += '<ul>';
        listOpen = true;
      }
      html += `<li>${escapeHtml(line.slice(2))}</li>`;
    } else {
      if (listOpen) {
        html += '</ul>';
        listOpen = false;
      }
      html += `<p>${escapeHtml(line)}</p>`;
    }
  }
  if (listOpen) html += '</ul>';
  return html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

function blogListBody(lang: Lang): string {
  const en = lang === 'en';
  const posts = en ? blogPostsEn : blogPostsEs;
  return `${siteHeader(lang)}<main style="max-width:960px;margin:0 auto;padding:2.5rem 1.5rem;font-family:Inter,system-ui,sans-serif;color:#1f2937">
  <h1>${en ? 'PDF Tips and Guides' : 'Guias y consejos PDF'}</h1>
  <p>${en ? 'Practical guides for converting, editing, compressing and organising PDF files with FlowToPDF.' : 'Guias practicas para convertir, editar, comprimir y organizar archivos PDF con FlowToPDF.'}</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1rem;margin-top:2rem">${posts.map((post) => `<article style="border:1px solid #e5e7eb;border-radius:.5rem;padding:1rem"><h2 style="font-size:1.1rem"><a href="/${lang}/blog/${post.slug}/">${escapeHtml(post.title)}</a></h2><p>${escapeHtml(post.excerpt)}</p><time datetime="${post.date}">${post.date}</time></article>`).join('')}</div>
</main>${siteFooter(lang)}`;
}

function blogPostBody(post: (typeof blogPostsEn)[number], lang: Lang): string {
  const en = lang === 'en';
  const related = (post.relatedTools ?? [])
    .map((id) => tools.find((tool) => tool.id === id))
    .filter(Boolean)
    .map((tool) => `<li><a href="/${lang}/${tool!.slug[lang]}/">${escapeHtml(localeTool(tool!.id, lang).name)}</a></li>`)
    .join('');
  return `${siteHeader(lang)}<main style="max-width:820px;margin:0 auto;padding:2.5rem 1.5rem;font-family:Inter,system-ui,sans-serif;color:#1f2937;line-height:1.7">
  <nav aria-label="Breadcrumb"><a href="/${lang}/">FlowToPDF</a> &gt; <a href="/${lang}/blog/">Blog</a> &gt; <span>${escapeHtml(post.title)}</span></nav>
  <article>
    <h1>${escapeHtml(post.title)}</h1>
    <p style="color:#6b7280"><span>${en ? 'Updated' : 'Actualizado'} <time datetime="${post.date}">${post.date}</time></span> · <span>${escapeHtml(post.author)}</span></p>
    <p style="font-size:1.1rem;color:#4b5563">${escapeHtml(post.excerpt)}</p>
    ${markdownToHtml(post.content)}
    ${related ? `<section><h2>${en ? 'Related tools' : 'Herramientas relacionadas'}</h2><ul>${related}</ul></section>` : ''}
  </article>
</main>${siteFooter(lang)}`;
}

function articleJsonLd(post: (typeof blogPostsEn)[number], lang: Lang): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: post.author },
    publisher: { '@type': 'Organization', name: 'FlowToPDF', url: SITE },
    mainEntityOfPage: abs(`/${lang}/blog/${post.slug}/`),
  });
}

function buildRoutes(): RouteMeta[] {
  const routes: RouteMeta[] = [{
    out: 'index.html',
    url: '/',
    lang: 'en',
    alternate: { en: '/en/', es: '/es/' },
    title: 'FlowToPDF - Free Online PDF Tools',
    description: 'Free online PDF tools to convert, merge, split, compress, rotate and OCR files. No account required.',
    body: homeBody('en', true),
    changefreq: 'weekly',
    priority: '1.0',
  }];

  for (const lang of ['en', 'es'] as const) {
    const en = lang === 'en';
    routes.push({
      out: `${lang}/index.html`,
      url: `/${lang}/`,
      lang,
      alternate: { en: '/en/', es: '/es/' },
      title: en ? 'FlowToPDF - Free Online PDF Tools' : 'FlowToPDF - Herramientas PDF gratis online',
      description: en
        ? 'Free online PDF tools to convert, merge, split, compress, rotate and OCR files. No account required.'
        : 'Herramientas PDF gratis para convertir, unir, dividir, comprimir, rotar y aplicar OCR. Sin registro.',
      body: homeBody(lang),
      changefreq: 'weekly',
      priority: '1.0',
    });
  }

  const categoryMeta = {
    'pdf-converter': { en: ['pdf-converter', 'PDF Converter Tools', 'Convert PDF files to Word, JPG, PNG, text and more. Convert other document formats to PDF.'], es: ['convertidor-pdf', 'Convertidores PDF', 'Convierte PDF a Word, JPG, PNG, texto y mas. Convierte otros documentos a PDF.'] },
    'image-to-pdf': { en: ['image-to-pdf', 'Image to PDF Tools', 'Convert JPG, PNG, WebP, GIF and SVG images into PDF documents.'], es: ['imagen-a-pdf', 'Imagen a PDF', 'Convierte imagenes JPG, PNG, WebP, GIF y SVG en documentos PDF.'] },
    'pdf-tools': { en: ['pdf-tools', 'PDF Editing Tools', 'Merge, split, compress, rotate, protect, unlock and OCR PDF files online.'], es: ['herramientas-pdf', 'Herramientas PDF', 'Une, divide, comprime, rota, protege, desbloquea y aplica OCR a PDFs online.'] },
    'office-to-pdf': { en: ['office-to-pdf', 'Office to PDF Tools', 'Convert Word, Excel, PowerPoint, ODT and RTF documents into PDFs.'], es: ['office-a-pdf', 'Office a PDF', 'Convierte documentos Word, Excel, PowerPoint, ODT y RTF a PDF.'] },
  } as const;

  for (const category of categories) {
    for (const lang of ['en', 'es'] as const) {
      const data = categoryMeta[category.id][lang];
      const catTools = tools.filter((tool) => tool.available && tool.category === category.id && tool.id !== 'image-to-pdf');
      routes.push({
        out: `${lang}/${data[0]}/index.html`,
        url: `/${lang}/${data[0]}/`,
        lang,
        alternate: { en: `/en/${categoryMeta[category.id].en[0]}/`, es: `/es/${categoryMeta[category.id].es[0]}/` },
        title: `${data[1]} | FlowToPDF`,
        description: data[2],
        body: `${siteHeader(lang)}<main style="max-width:960px;margin:0 auto;padding:2.5rem 1.5rem;font-family:Inter,system-ui,sans-serif"><h1>${data[1]}</h1><p>${data[2]}</p><ul>${catTools.map((tool) => `<li><a href="/${lang}/${tool.slug[lang]}/">${escapeHtml(localeTool(tool.id, lang).name)}</a> - ${escapeHtml(localeTool(tool.id, lang).desc)}</li>`).join('')}</ul></main>${siteFooter(lang)}`,
        changefreq: 'monthly',
        priority: '0.8',
      });
    }
  }

  for (const tool of tools.filter((item) => item.available && item.id !== 'image-to-pdf')) {
    for (const lang of ['en', 'es'] as const) {
      const locale = localeTool(tool.id, lang);
      const seo = seoForTool(tool.id, lang);
      routes.push({
        out: `${lang}/${tool.slug[lang]}/index.html`,
        url: `/${lang}/${tool.slug[lang]}/`,
        lang,
        alternate: { en: `/en/${tool.slug.en}/`, es: `/es/${tool.slug.es}/` },
        title: lang === 'en' ? `${locale.name} - Free Online | FlowToPDF` : `${locale.name} gratis online | FlowToPDF`,
        description: metaDescription(seo.intro),
        body: toolBody(tool.id, lang),
        jsonLd: [faqJsonLd(seo.faqs), howToJsonLd(locale.name, lang)],
        changefreq: 'monthly',
        priority: '0.9',
      });
    }
  }

  const staticPages = [
    { en: 'about', es: 'sobre-nosotros', titleEn: 'About FlowToPDF', titleEs: 'Sobre FlowToPDF', descEn: 'Learn about FlowToPDF, a privacy-first toolkit for free online PDF conversion and editing.', descEs: 'Conoce FlowToPDF, una herramienta privada para convertir y editar PDFs gratis online.' },
    { en: 'contact', es: 'contacto', titleEn: 'Contact FlowToPDF', titleEs: 'Contacto FlowToPDF', descEn: 'Contact FlowToPDF for support, feedback and partnership questions.', descEs: 'Contacta con FlowToPDF para soporte, comentarios y colaboraciones.' },
    { en: 'privacy-policy', es: 'politica-de-privacidad', titleEn: 'Privacy Policy', titleEs: 'Politica de privacidad', descEn: 'How FlowToPDF handles uploaded files, temporary processing and privacy.', descEs: 'Como FlowToPDF gestiona archivos subidos, procesamiento temporal y privacidad.' },
    { en: 'terms', es: 'terminos', titleEn: 'Terms of Service', titleEs: 'Terminos de servicio', descEn: 'Terms for using FlowToPDF free online PDF tools.', descEs: 'Terminos para usar las herramientas PDF gratuitas de FlowToPDF.' },
    { en: 'cookie-policy', es: 'politica-de-cookies', titleEn: 'Cookie Policy', titleEs: 'Politica de cookies', descEn: 'Cookies and similar technologies used by FlowToPDF.', descEs: 'Cookies y tecnologias similares usadas por FlowToPDF.' },
    { en: 'dmca', es: 'dmca', titleEn: 'DMCA Policy', titleEs: 'Politica DMCA', descEn: 'DMCA contact and takedown policy for FlowToPDF.', descEs: 'Contacto y politica DMCA de FlowToPDF.' },
    { en: 'disclaimer', es: 'aviso-legal', titleEn: 'Disclaimer', titleEs: 'Aviso legal', descEn: 'Service limitations and conversion quality disclaimer for FlowToPDF.', descEs: 'Limitaciones del servicio y calidad de conversion en FlowToPDF.' },
  ];
  for (const page of staticPages) {
    for (const lang of ['en', 'es'] as const) {
      const en = lang === 'en';
      const slug = en ? page.en : page.es;
      routes.push({
        out: `${lang}/${slug}/index.html`,
        url: `/${lang}/${slug}/`,
        lang,
        alternate: { en: `/en/${page.en}/`, es: `/es/${page.es}/` },
        title: `${en ? page.titleEn : page.titleEs} | FlowToPDF`,
        description: en ? page.descEn : page.descEs,
        body: `${siteHeader(lang)}<main style="max-width:760px;margin:0 auto;padding:2.5rem 1.5rem;font-family:Inter,system-ui,sans-serif;line-height:1.7"><h1>${escapeHtml(en ? page.titleEn : page.titleEs)}</h1><p>${escapeHtml(en ? page.descEn : page.descEs)}</p><p>${en ? 'This page is part of the public FlowToPDF documentation and is available as static HTML for search engines and users.' : 'Esta pagina forma parte de la documentacion publica de FlowToPDF y esta disponible como HTML estatico para buscadores y usuarios.'}</p></main>${siteFooter(lang)}`,
        changefreq: 'yearly',
        priority: '0.4',
      });
    }
  }

  for (const lang of ['en', 'es'] as const) {
    const posts = lang === 'en' ? blogPostsEn : blogPostsEs;
    routes.push({
      out: `${lang}/blog/index.html`,
      url: `/${lang}/blog/`,
      lang,
      alternate: { en: '/en/blog/', es: '/es/blog/' },
      title: lang === 'en' ? 'PDF Tips and Guides | FlowToPDF Blog' : 'Guias y consejos PDF | Blog FlowToPDF',
      description: lang === 'en' ? 'Guides about PDF conversion, compression, merging, OCR and document workflows.' : 'Guias sobre conversion PDF, compresion, union, OCR y flujos de documentos.',
      body: blogListBody(lang),
      changefreq: 'weekly',
      priority: '0.7',
    });
    for (const post of posts) {
      const alternatePosts = lang === 'en' ? blogPostsEs : blogPostsEn;
      const alt = alternatePosts.find((candidate) => candidate.relatedTools?.[0] === post.relatedTools?.[0]);
      routes.push({
        out: `${lang}/blog/${post.slug}/index.html`,
        url: `/${lang}/blog/${post.slug}/`,
        lang,
        alternate: {
          en: lang === 'en' ? `/en/blog/${post.slug}/` : `/en/blog/${alt?.slug ?? ''}`,
          es: lang === 'es' ? `/es/blog/${post.slug}/` : `/es/blog/${alt?.slug ?? ''}`,
        },
        title: `${post.title} | FlowToPDF Blog`,
        description: metaDescription(post.excerpt),
        body: blogPostBody(post, lang),
        jsonLd: [articleJsonLd(post, lang)],
        changefreq: 'monthly',
        priority: '0.6',
      });
    }
  }

  return routes;
}

function rewriteHtml(template: string, route: RouteMeta): string {
  const canonical = route.url === '/' ? `${SITE}/` : abs(route.url);
  const rootMatch = template.match(/<div id="root">[\s\S]*?<\/div>(\s*<\/body>)/);
  if (!rootMatch) throw new Error('Could not locate root div in template');
  let html = template.replace(rootMatch[0], `<div id="root">${route.body}</div>${rootMatch[1]}`);
  html = html.replace(/<html lang="[^"]*"/, `<html lang="${route.lang}"`);
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(route.title)}</title>`);
  html = html.replace(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${escapeHtml(route.description)}" />`);
  html = html.replace(/<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${escapeHtml(route.title)}" />`);
  html = html.replace(/<meta property="og:description" content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${escapeHtml(route.description)}" />`);
  html = html.replace(/<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${canonical}" />`);
  html = html.replace(/<meta name="twitter:title" content="[^"]*"\s*\/?>/, `<meta name="twitter:title" content="${escapeHtml(route.title)}" />`);
  html = html.replace(/<meta name="twitter:description" content="[^"]*"\s*\/?>/, `<meta name="twitter:description" content="${escapeHtml(route.description)}" />`);
  html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${canonical}" />`);
  html = html.replace(/<link rel="alternate" hreflang="en" href="[^"]*"\s*\/?>/, `<link rel="alternate" hreflang="en" href="${abs(route.alternate.en)}" />`);
  html = html.replace(/<link rel="alternate" hreflang="es" href="[^"]*"\s*\/?>/, `<link rel="alternate" hreflang="es" href="${abs(route.alternate.es)}" />`);
  html = html.replace(/<link rel="alternate" hreflang="x-default" href="[^"]*"\s*\/?>/, `<link rel="alternate" hreflang="x-default" href="${abs(route.alternate.en)}" />`);
  if (route.jsonLd?.length) {
    html = html.replace('</head>', `${route.jsonLd.map((json) => `    <script type="application/ld+json">${json}</script>`).join('\n')}\n  </head>`);
  }
  return html;
}

function writeSitemap(routes: RouteMeta[]): void {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${routes.map((route) => {
    const loc = route.url === '/' ? `${SITE}/` : abs(route.url);
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${LASTMOD}</lastmod>\n    <changefreq>${route.changefreq ?? 'monthly'}</changefreq>\n    <priority>${route.priority ?? '0.7'}</priority>\n    <xhtml:link rel="alternate" hreflang="en" href="${abs(route.alternate.en)}"/>\n    <xhtml:link rel="alternate" hreflang="es" href="${abs(route.alternate.es)}"/>\n    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(route.alternate.en)}"/>\n  </url>`;
  }).join('\n')}\n</urlset>\n`;
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), xml, 'utf-8');
  fs.writeFileSync(path.join(PUBLIC, 'sitemap.xml'), xml, 'utf-8');
}

function writeRobots(): void {
  const robots = `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin/\nDisallow: /tmp/\nDisallow: /uploads/\nDisallow: /processing/\nDisallow: /download/\n\nSitemap: https://flowtopdf.com/sitemap.xml\n`;
  fs.writeFileSync(path.join(DIST, 'robots.txt'), robots, 'utf-8');
  fs.writeFileSync(path.join(PUBLIC, 'robots.txt'), robots, 'utf-8');
}

function writeRedirects(routes: RouteMeta[]): void {
  const redirects = [
    'http://flowtopdf.com/* https://flowtopdf.com/:splat 301!',
    'http://www.flowtopdf.com/* https://flowtopdf.com/:splat 301!',
    'https://www.flowtopdf.com/* https://flowtopdf.com/:splat 301!',
    '/en/privacy/ /en/privacy-policy/ 301!',
    '/es/privacidad/ /es/politica-de-privacidad/ 301!',
    '/en/cookies/ /en/cookie-policy/ 301!',
    '/es/politica-cookies/ /es/politica-de-cookies/ 301!',
  ];
  for (const route of routes) {
    if (route.url !== '/' && route.url.endsWith('/')) {
      redirects.push(`${route.url.slice(0, -1)} ${route.url} 301!`);
    }
  }
  redirects.push('/api/* https://convertflow-jir8.onrender.com/api/:splat 200!');
  redirects.push('/* /404.html 404');
  fs.writeFileSync(path.join(DIST, '_redirects'), `${redirects.join('\n')}\n`, 'utf-8');
}

function write404(template: string): void {
  const route: RouteMeta = {
    out: '404.html',
    url: '/404/',
    lang: 'en',
    alternate: { en: '/en/', es: '/es/' },
    title: 'Page Not Found | FlowToPDF',
    description: 'The requested FlowToPDF page could not be found.',
    body: `${siteHeader('en')}<main style="max-width:720px;margin:0 auto;padding:3rem 1.5rem;font-family:Inter,system-ui,sans-serif"><h1>Page not found</h1><p>This URL is not an indexable FlowToPDF page.</p><p><a href="/en/">Go to FlowToPDF tools</a></p></main>${siteFooter('en')}`,
  };
  let html = rewriteHtml(template, route);
  html = html.replace('</head>', '    <meta name="robots" content="noindex,follow" />\n  </head>');
  fs.writeFileSync(path.join(DIST, '404.html'), html, 'utf-8');
}

function main(): void {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error(`[prerender] template not found at ${TEMPLATE_PATH}; run vite build first`);
    process.exit(1);
  }
  const template = fs.readFileSync(TEMPLATE_PATH, 'utf-8');
  const routes = buildRoutes();
  const seen = new Set<string>();
  let written = 0;
  for (const route of routes) {
    if (seen.has(route.url)) throw new Error(`Duplicate route URL: ${route.url}`);
    seen.add(route.url);
    const outPath = path.join(DIST, route.out);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, rewriteHtml(template, route), 'utf-8');
    written++;
  }
  write404(template);
  writeSitemap(routes);
  writeRobots();
  writeRedirects(routes);
  console.log(`[prerender] wrote ${written} HTML files plus sitemap.xml, robots.txt and _redirects`);
}

main();
