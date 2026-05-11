import { useParams, Navigate } from 'react-router-dom';
import { useTranslation } from '../lib/i18n';
import { tools, getToolsByCategory, type ToolCategory } from '../lib/toolsConfig';
import { generateMetaTags } from '../lib/seo';
import SEOHead from '../components/SEOHead';
import Breadcrumbs from '../components/Breadcrumbs';
import ToolGrid from '../components/ToolGrid';

interface CategoryPageProps {
  categoryId: ToolCategory;
}

const categoryMeta: Record<ToolCategory, {
  en: { title: string; desc: string };
  es: { title: string; desc: string };
  pageId: string;
}> = {
  'pdf-converter': {
    pageId: 'home',
    en: {
      title: 'PDF Converter Tools – Free Online | FlowToPDF',
      desc: 'Free online PDF converter tools. Convert PDF to Word, JPG, PNG, text, HTML, and more. No registration required.',
    },
    es: {
      title: 'Herramientas Convertidor PDF – Gratis Online | FlowToPDF',
      desc: 'Herramientas convertidor PDF gratuitas. Convierte PDF a Word, JPG, PNG, texto, HTML y más. Sin registro.',
    },
  },
  'image-to-pdf': {
    pageId: 'home',
    en: {
      title: 'Image to PDF Converter – Free Online | FlowToPDF',
      desc: 'Convert JPG, PNG, WebP, GIF, and SVG images to PDF online for free. Batch convert multiple images.',
    },
    es: {
      title: 'Convertir Imagen a PDF – Gratis Online | FlowToPDF',
      desc: 'Convierte imágenes JPG, PNG, WebP, GIF y SVG a PDF gratis online. Convierte varias imágenes a la vez.',
    },
  },
  'pdf-tools': {
    pageId: 'home',
    en: {
      title: 'PDF Tools – Merge, Split, Compress & More | FlowToPDF',
      desc: 'Free PDF tools: merge, split, compress, rotate, protect, unlock, reorder, extract pages, and OCR.',
    },
    es: {
      title: 'Herramientas PDF – Unir, Dividir, Comprimir y Más | FlowToPDF',
      desc: 'Herramientas PDF gratuitas: unir, dividir, comprimir, rotar, proteger, desbloquear, reordenar y más.',
    },
  },
  'office-to-pdf': {
    pageId: 'home',
    en: {
      title: 'Office to PDF Converter – Free Online | FlowToPDF',
      desc: 'Convert Word, Excel, PowerPoint, ODT, and RTF files to PDF online for free.',
    },
    es: {
      title: 'Convertir Office a PDF – Gratis Online | FlowToPDF',
      desc: 'Convierte Word, Excel, PowerPoint, ODT y archivos RTF a PDF gratis online.',
    },
  },
};

const categoryTitles: Record<ToolCategory, { en: string; es: string }> = {
  'pdf-converter': { en: 'PDF Converter', es: 'Convertidor PDF' },
  'image-to-pdf': { en: 'Image to PDF', es: 'Imagen a PDF' },
  'pdf-tools': { en: 'PDF Tools', es: 'Herramientas PDF' },
  'office-to-pdf': { en: 'Office to PDF', es: 'Office a PDF' },
};

const categoryDescriptions: Record<ToolCategory, { en: string; es: string }> = {
  'pdf-converter': {
    en: 'Convert PDF files to Word, JPG, PNG, and other formats, or convert other documents to PDF.',
    es: 'Convierte archivos PDF a Word, JPG, PNG y otros formatos, o convierte otros documentos a PDF.',
  },
  'image-to-pdf': {
    en: 'Turn your images into PDF files. Supports JPG, PNG, WebP, GIF, and SVG formats.',
    es: 'Convierte tus imágenes en archivos PDF. Soporta formatos JPG, PNG, WebP, GIF y SVG.',
  },
  'pdf-tools': {
    en: 'A complete set of tools to work with your PDF files — merge, split, compress, rotate, protect, and more.',
    es: 'Un conjunto completo de herramientas para trabajar con tus archivos PDF — unir, dividir, comprimir, rotar, proteger y más.',
  },
  'office-to-pdf': {
    en: 'Convert Microsoft Office and OpenDocument files to PDF format with a single click.',
    es: 'Convierte archivos de Microsoft Office y OpenDocument a formato PDF con un solo clic.',
  },
};

// Slug-to-category mapping
const slugToCategory: Record<string, ToolCategory> = {
  'pdf-converter': 'pdf-converter',
  'convertidor-pdf': 'pdf-converter',
  'image-to-pdf': 'image-to-pdf',
  'imagen-a-pdf': 'image-to-pdf',
  'pdf-tools': 'pdf-tools',
  'herramientas-pdf': 'pdf-tools',
  'office-to-pdf': 'office-to-pdf',
  'office-a-pdf': 'office-to-pdf',
};

export default function CategoryPage({ categoryId: propCategoryId }: CategoryPageProps) {
  const { lang } = useTranslation();
  const params = useParams<{ slug?: string }>();

  const categoryId: ToolCategory | undefined =
    propCategoryId ?? (params.slug ? slugToCategory[params.slug] : undefined);

  if (!categoryId) {
    return <Navigate to={`/${lang}/`} replace />;
  }

  const meta = categoryMeta[categoryId];
  const pageTitle = meta[lang].title;
  const pageDesc = meta[lang].desc;
  const generatedMeta = generateMetaTags('home', lang);
  const categorySlug: Record<ToolCategory, { en: string; es: string }> = {
    'pdf-converter': { en: 'pdf-converter', es: 'convertidor-pdf' },
    'image-to-pdf': { en: 'image-to-pdf', es: 'imagen-a-pdf' },
    'pdf-tools': { en: 'pdf-tools', es: 'herramientas-pdf' },
    'office-to-pdf': { en: 'office-to-pdf', es: 'office-a-pdf' },
  };
  const canonical = `https://flowtopdf.com/${lang}/${categorySlug[categoryId][lang]}/`;
  const alternateLang = lang === 'en' ? 'es' : 'en';
  const alternate = `https://flowtopdf.com/${alternateLang}/${categorySlug[categoryId][alternateLang]}/`;
  const finalMeta = {
    ...generatedMeta,
    title: pageTitle,
    description: pageDesc,
    canonical,
    ogTitle: pageTitle,
    ogDescription: pageDesc,
    ogUrl: canonical,
    twitterTitle: pageTitle,
    twitterDescription: pageDesc,
    alternates: [
      { hreflang: lang, href: canonical },
      { hreflang: alternateLang, href: alternate },
      { hreflang: 'x-default', href: `https://flowtopdf.com/en/${categorySlug[categoryId].en}/` },
    ],
  };

  const categoryTools = getToolsByCategory(categoryId);
  const title = categoryTitles[categoryId][lang];
  const desc = categoryDescriptions[categoryId][lang];

  // Unused but keeping the import clean
  void tools;

  return (
    <>
      <SEOHead meta={finalMeta} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />

        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">{title}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">{desc}</p>
        </div>

        <ToolGrid tools={categoryTools} showSearch={true} />
      </main>
    </>
  );
}
