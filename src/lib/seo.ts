import type { Lang } from './i18n';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface MetaTags {
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  alternates: { hreflang: string; href: string }[];
  jsonLd?: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

// ─── Base config ─────────────────────────────────────────────────────────────

const SITE_URL = 'https://FlowToPDF.app';
const SITE_NAME = 'FlowToPDF';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

// ─── Page meta definitions ───────────────────────────────────────────────────

interface PageMeta {
  en: { title: string; description: string };
  es: { title: string; description: string };
  slug: { en: string; es: string };
}

const pageMeta: Record<string, PageMeta> = {
  home: {
    slug: { en: '', es: '' },
    en: {
      title: 'FlowToPDF - Free PDF Converter Tools Online',
      description:
        'Free online PDF tools — convert, merge, split, compress, rotate and edit PDF files instantly. No registration required. Fast, secure, and easy to use.',
    },
    es: {
      title: 'FlowToPDF - Herramientas PDF gratuitas online',
      description:
        'Herramientas PDF gratuitas — convierte, une, divide, comprime y edita archivos PDF online. Sin registro. Rápido, seguro y fácil de usar.',
    },
  },
  'pdf-to-word': {
    slug: { en: 'pdf-to-word', es: 'pdf-a-word' },
    en: {
      title: 'PDF to Word Converter - Free Online | FlowToPDF',
      description:
        'Convert PDF to editable Word documents (DOCX) online for free. Preserve layout and formatting. No registration, no watermarks.',
    },
    es: {
      title: 'Convertir PDF a Word gratis online | FlowToPDF',
      description:
        'Convierte PDF a documentos Word editables (DOCX) gratis online. Mantén el formato. Sin registro ni marcas de agua.',
    },
  },
  'word-to-pdf': {
    slug: { en: 'word-to-pdf', es: 'word-a-pdf' },
    en: {
      title: 'Word to PDF Converter - Free Online | FlowToPDF',
      description:
        'Convert Word documents (DOC, DOCX) to PDF online for free. Fast and secure. No software installation needed.',
    },
    es: {
      title: 'Convertir Word a PDF gratis online | FlowToPDF',
      description:
        'Convierte documentos Word (DOC, DOCX) a PDF gratis online. Rápido y seguro. Sin instalar nada.',
    },
  },
  'jpg-to-pdf': {
    slug: { en: 'jpg-to-pdf', es: 'jpg-a-pdf' },
    en: {
      title: 'JPG to PDF Converter - Free Online | FlowToPDF',
      description:
        'Convert JPG images to PDF online for free. Combine multiple JPGs into one PDF. Choose page size and margins.',
    },
    es: {
      title: 'Convertir JPG a PDF gratis online | FlowToPDF',
      description:
        'Convierte imágenes JPG a PDF gratis online. Combina varios JPG en un PDF. Elige tamaño de página y márgenes.',
    },
  },
  'png-to-pdf': {
    slug: { en: 'png-to-pdf', es: 'png-a-pdf' },
    en: {
      title: 'PNG to PDF Converter - Free Online | FlowToPDF',
      description:
        'Convert PNG images to PDF online for free. Batch convert multiple PNGs. Fast and secure.',
    },
    es: {
      title: 'Convertir PNG a PDF gratis online | FlowToPDF',
      description:
        'Convierte imágenes PNG a PDF gratis online. Convierte varios PNG a la vez. Rápido y seguro.',
    },
  },
  'pdf-to-jpg': {
    slug: { en: 'pdf-to-jpg', es: 'pdf-a-jpg' },
    en: {
      title: 'PDF to JPG Converter - Free Online | FlowToPDF',
      description:
        'Convert PDF pages to JPG images online for free. Extract every page as a separate JPG.',
    },
    es: {
      title: 'Convertir PDF a JPG gratis online | FlowToPDF',
      description:
        'Convierte páginas de PDF a imágenes JPG gratis online. Extrae cada página como un JPG.',
    },
  },
  'pdf-to-png': {
    slug: { en: 'pdf-to-png', es: 'pdf-a-png' },
    en: {
      title: 'PDF to PNG Converter - Free Online | FlowToPDF',
      description:
        'Convert PDF pages to PNG images online for free. High-quality output, no watermarks.',
    },
    es: {
      title: 'Convertir PDF a PNG gratis online | FlowToPDF',
      description:
        'Convierte páginas de PDF a imágenes PNG gratis online. Alta calidad, sin marcas de agua.',
    },
  },
  'merge-pdf': {
    slug: { en: 'merge-pdf', es: 'unir-pdf' },
    en: {
      title: 'Merge PDF Files Free Online | FlowToPDF',
      description:
        'Combine multiple PDF files into one. Upload up to 20 PDFs and merge them in any order. Free, fast, and secure.',
    },
    es: {
      title: 'Unir archivos PDF gratis online | FlowToPDF',
      description:
        'Combina varios archivos PDF en uno. Sube hasta 20 PDFs y únelos en el orden que quieras. Gratis, rápido y seguro.',
    },
  },
  'split-pdf': {
    slug: { en: 'split-pdf', es: 'dividir-pdf' },
    en: {
      title: 'Split PDF Online Free | FlowToPDF',
      description:
        'Split a PDF into individual pages or custom page ranges. Download results as a ZIP file. Free and easy.',
    },
    es: {
      title: 'Dividir PDF online gratis | FlowToPDF',
      description:
        'Divide un PDF en páginas individuales o rangos personalizados. Descarga el resultado en ZIP. Gratis y fácil.',
    },
  },
  'compress-pdf': {
    slug: { en: 'compress-pdf', es: 'comprimir-pdf' },
    en: {
      title: 'Compress PDF Online Free | FlowToPDF',
      description:
        'Reduce the size of your PDF file online for free. Choose compression level. No quality loss on low setting.',
    },
    es: {
      title: 'Comprimir PDF online gratis | FlowToPDF',
      description:
        'Reduce el tamaño de tu PDF gratis online. Elige el nivel de compresión. Sin perder calidad en nivel bajo.',
    },
  },
  'rotate-pdf': {
    slug: { en: 'rotate-pdf', es: 'rotar-pdf' },
    en: {
      title: 'Rotate PDF Online Free | FlowToPDF',
      description:
        'Rotate PDF pages online for free. Rotate all pages or specific ones by 90, 180, or 270 degrees.',
    },
    es: {
      title: 'Rotar PDF online gratis | FlowToPDF',
      description:
        'Rota páginas de PDF gratis online. Rota todas las páginas o las que elijas 90, 180 o 270 grados.',
    },
  },
  'protect-pdf': {
    slug: { en: 'protect-pdf', es: 'proteger-pdf' },
    en: {
      title: 'Protect PDF with Password Free | FlowToPDF',
      description:
        'Add a password to your PDF file online for free. Keep your documents private and secure.',
    },
    es: {
      title: 'Proteger PDF con contraseña gratis | FlowToPDF',
      description:
        'Añade una contraseña a tu PDF gratis online. Mantén tus documentos privados y seguros.',
    },
  },
  'unlock-pdf': {
    slug: { en: 'unlock-pdf', es: 'desbloquear-pdf' },
    en: {
      title: 'Unlock PDF Online Free | FlowToPDF',
      description:
        'Remove password protection from a PDF online for free. You must know the password to unlock it.',
    },
    es: {
      title: 'Desbloquear PDF online gratis | FlowToPDF',
      description:
        'Elimina la protección por contraseña de un PDF gratis online. Necesitas conocer la contraseña.',
    },
  },
  'ocr-pdf': {
    slug: { en: 'ocr-pdf', es: 'ocr-pdf' },
    en: {
      title: 'OCR PDF - Make Scanned PDFs Searchable | FlowToPDF',
      description:
        'Use OCR to make scanned PDFs searchable and selectable. Supports English, Spanish, French and more.',
    },
    es: {
      title: 'OCR PDF - Convierte PDF escaneados en texto buscable | FlowToPDF',
      description:
        'Usa el reconocimiento óptico de caracteres para hacer tus PDFs escaneados buscables. Compatible con varios idiomas.',
    },
  },
  blog: {
    slug: { en: 'blog', es: 'blog' },
    en: {
      title: 'Blog - PDF Tips & Guides | FlowToPDF',
      description:
        'Tips, guides, and tutorials about PDF tools, document conversion, and productivity. Free resources from FlowToPDF.',
    },
    es: {
      title: 'Blog - Guías y consejos PDF | FlowToPDF',
      description:
        'Guías, tutoriales y consejos sobre herramientas PDF, conversión de documentos y productividad. Recursos gratuitos de FlowToPDF.',
    },
  },
  about: {
    slug: { en: 'about', es: 'acerca-de' },
    en: {
      title: 'About FlowToPDF | Free PDF Tools Online',
      description:
        'Learn about FlowToPDF — the free online PDF toolkit built for speed, privacy, and simplicity.',
    },
    es: {
      title: 'Sobre FlowToPDF | Herramientas PDF gratuitas',
      description:
        'Conoce FlowToPDF — el kit de herramientas PDF online gratuito diseñado para ser rápido, privado y fácil de usar.',
    },
  },
  contact: {
    slug: { en: 'contact', es: 'contacto' },
    en: {
      title: 'Contact Us | FlowToPDF',
      description: 'Get in touch with the FlowToPDF team for support, feedback, or partnership inquiries.',
    },
    es: {
      title: 'Contacto | FlowToPDF',
      description:
        'Contacta con el equipo de FlowToPDF para soporte, comentarios o consultas de colaboración.',
    },
  },
  privacy: {
    slug: { en: 'privacy', es: 'privacidad' },
    en: {
      title: 'Privacy Policy | FlowToPDF',
      description: 'Read the FlowToPDF privacy policy. We are committed to protecting your data and files.',
    },
    es: {
      title: 'Política de privacidad | FlowToPDF',
      description: 'Lee la política de privacidad de FlowToPDF. Nos comprometemos a proteger tus datos y archivos.',
    },
  },
  terms: {
    slug: { en: 'terms', es: 'terminos' },
    en: {
      title: 'Terms of Service | FlowToPDF',
      description: 'Read the FlowToPDF terms of service and acceptable use policy.',
    },
    es: {
      title: 'Términos de servicio | FlowToPDF',
      description: 'Lee los términos de servicio y la política de uso aceptable de FlowToPDF.',
    },
  },
};

// ─── generateMetaTags ────────────────────────────────────────────────────────

export function generateMetaTags(page: string, lang: Lang): MetaTags {
  const meta = pageMeta[page] ?? pageMeta['home'];
  const localeMeta = meta[lang] ?? meta['en'];
  const slug = meta.slug[lang] ?? meta.slug['en'];

  const langPath = `/${lang}/${slug}`.replace(/\/$/, '') || `/${lang}`;
  const canonical = `${SITE_URL}${langPath}`;

  const alternateLang: Lang = lang === 'en' ? 'es' : 'en';
  const altSlug = meta.slug[alternateLang] ?? meta.slug['en'];
  const altPath = `/${alternateLang}/${altSlug}`.replace(/\/$/, '') || `/${alternateLang}`;
  const altHref = `${SITE_URL}${altPath}`;

  return {
    title: localeMeta.title,
    description: localeMeta.description,
    canonical,
    ogTitle: localeMeta.title,
    ogDescription: localeMeta.description,
    ogUrl: canonical,
    ogImage: DEFAULT_OG_IMAGE,
    twitterTitle: localeMeta.title,
    twitterDescription: localeMeta.description,
    alternates: [
      { hreflang: lang, href: canonical },
      { hreflang: alternateLang, href: altHref },
      { hreflang: 'x-default', href: `${SITE_URL}/en/` },
    ],
  };
}

// ─── generateStructuredData ──────────────────────────────────────────────────

export function generateStructuredData(
  type: 'WebSite' | 'WebPage' | 'SoftwareApplication' | 'BreadcrumbList' | 'FAQPage',
  data: Record<string, unknown>
): string {
  const base: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': type,
  };

  if (type === 'WebSite') {
    return JSON.stringify({
      ...base,
      name: SITE_NAME,
      url: SITE_URL,
      description: 'Free online PDF converter and editor tools.',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_URL}/en/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
      ...data,
    });
  }

  if (type === 'SoftwareApplication') {
    return JSON.stringify({
      ...base,
      name: data['name'] ?? SITE_NAME,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web Browser',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      ...data,
    });
  }

  if (type === 'FAQPage') {
    const items = (data['items'] as Array<{ q: string; a: string }> | undefined) ?? [];
    return JSON.stringify({
      ...base,
      mainEntity: items.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    });
  }

  return JSON.stringify({ ...base, ...data });
}

// ─── generateBreadcrumbs ─────────────────────────────────────────────────────

export function generateBreadcrumbs(path: string, lang: Lang): BreadcrumbItem[] {
  const crumbs: BreadcrumbItem[] = [
    { name: 'FlowToPDF', url: `${SITE_URL}/${lang}/` },
  ];

  const segments = path.replace(/^\//, '').split('/').filter(Boolean);
  // Skip the language segment
  const contentSegments = segments.filter((s) => s !== 'en' && s !== 'es');

  let accumulated = `${SITE_URL}/${lang}`;
  for (const segment of contentSegments) {
    accumulated += `/${segment}`;
    // Convert slug to readable name
    const name = segment
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    crumbs.push({ name, url: accumulated });
  }

  return crumbs;
}

/**
 * Serialize a breadcrumb list to JSON-LD.
 */
export function breadcrumbsToJsonLd(crumbs: BreadcrumbItem[]): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  });
}
