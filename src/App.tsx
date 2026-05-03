import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { LanguageProvider } from './lib/i18n';
import Header from './components/Header';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';

// Pages
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ToolPage from './pages/ToolPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SitemapPage from './pages/SitemapPage';
import NotFoundPage from './pages/NotFoundPage';

// Legal pages
import PrivacyPolicyPage from './pages/legal/PrivacyPolicyPage';
import TermsPage from './pages/legal/TermsPage';
import CookiePolicyPage from './pages/legal/CookiePolicyPage';
import DMCAPage from './pages/legal/DMCAPage';
import DisclaimerPage from './pages/legal/DisclaimerPage';

// ─── Root redirect (auto-detect language) ────────────────────────────────────
function RootRedirect() {
  const lang =
    localStorage.getItem('cf-lang') ??
    (navigator.language.startsWith('es') ? 'es' : 'en');
  return <Navigate to={`/${lang}/`} replace />;
}

// ─── Layout wrapper ───────────────────────────────────────────────────────────
function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
      <CookieBanner />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <Routes>
        {/* Root: redirect to language version */}
        <Route path="/" element={<RootRedirect />} />

        {/* ── English routes ── */}
        <Route
          path="/en/"
          element={<Layout><HomePage /></Layout>}
        />

        {/* EN Category pages */}
        <Route path="/en/pdf-converter" element={<Layout><CategoryPage categoryId="pdf-converter" /></Layout>} />
        <Route path="/en/image-to-pdf" element={<Layout><CategoryPage categoryId="image-to-pdf" /></Layout>} />
        <Route path="/en/pdf-tools" element={<Layout><CategoryPage categoryId="pdf-tools" /></Layout>} />
        <Route path="/en/office-to-pdf" element={<Layout><CategoryPage categoryId="office-to-pdf" /></Layout>} />

        {/* EN Tool pages */}
        <Route path="/en/pdf-to-word" element={<Layout><ToolPage toolSlug="pdf-to-word" lang="en" /></Layout>} />
        <Route path="/en/word-to-pdf" element={<Layout><ToolPage toolSlug="word-to-pdf" lang="en" /></Layout>} />
        <Route path="/en/docx-to-pdf" element={<Layout><ToolPage toolSlug="docx-to-pdf" lang="en" /></Layout>} />
        <Route path="/en/excel-to-pdf" element={<Layout><ToolPage toolSlug="excel-to-pdf" lang="en" /></Layout>} />
        <Route path="/en/powerpoint-to-pdf" element={<Layout><ToolPage toolSlug="powerpoint-to-pdf" lang="en" /></Layout>} />
        <Route path="/en/odt-to-pdf" element={<Layout><ToolPage toolSlug="odt-to-pdf" lang="en" /></Layout>} />
        <Route path="/en/rtf-to-pdf" element={<Layout><ToolPage toolSlug="rtf-to-pdf" lang="en" /></Layout>} />
        <Route path="/en/jpg-to-pdf" element={<Layout><ToolPage toolSlug="jpg-to-pdf" lang="en" /></Layout>} />
        <Route path="/en/png-to-pdf" element={<Layout><ToolPage toolSlug="png-to-pdf" lang="en" /></Layout>} />
        <Route path="/en/webp-to-pdf" element={<Layout><ToolPage toolSlug="webp-to-pdf" lang="en" /></Layout>} />
        <Route path="/en/gif-to-pdf" element={<Layout><ToolPage toolSlug="gif-to-pdf" lang="en" /></Layout>} />
        <Route path="/en/svg-to-pdf" element={<Layout><ToolPage toolSlug="svg-to-pdf" lang="en" /></Layout>} />
        <Route path="/en/image-to-pdf" element={<Layout><ToolPage toolSlug="image-to-pdf" lang="en" /></Layout>} />
        <Route path="/en/pdf-to-jpg" element={<Layout><ToolPage toolSlug="pdf-to-jpg" lang="en" /></Layout>} />
        <Route path="/en/pdf-to-png" element={<Layout><ToolPage toolSlug="pdf-to-png" lang="en" /></Layout>} />
        <Route path="/en/pdf-to-text" element={<Layout><ToolPage toolSlug="pdf-to-text" lang="en" /></Layout>} />
        <Route path="/en/text-to-pdf" element={<Layout><ToolPage toolSlug="text-to-pdf" lang="en" /></Layout>} />
        <Route path="/en/txt-to-pdf" element={<Layout><ToolPage toolSlug="txt-to-pdf" lang="en" /></Layout>} />
        <Route path="/en/html-to-pdf" element={<Layout><ToolPage toolSlug="html-to-pdf" lang="en" /></Layout>} />
        <Route path="/en/markdown-to-pdf" element={<Layout><ToolPage toolSlug="markdown-to-pdf" lang="en" /></Layout>} />
        <Route path="/en/csv-to-pdf" element={<Layout><ToolPage toolSlug="csv-to-pdf" lang="en" /></Layout>} />
        <Route path="/en/merge-pdf" element={<Layout><ToolPage toolSlug="merge-pdf" lang="en" /></Layout>} />
        <Route path="/en/split-pdf" element={<Layout><ToolPage toolSlug="split-pdf" lang="en" /></Layout>} />
        <Route path="/en/compress-pdf" element={<Layout><ToolPage toolSlug="compress-pdf" lang="en" /></Layout>} />
        <Route path="/en/rotate-pdf" element={<Layout><ToolPage toolSlug="rotate-pdf" lang="en" /></Layout>} />
        <Route path="/en/protect-pdf" element={<Layout><ToolPage toolSlug="protect-pdf" lang="en" /></Layout>} />
        <Route path="/en/unlock-pdf" element={<Layout><ToolPage toolSlug="unlock-pdf" lang="en" /></Layout>} />
        <Route path="/en/reorder-pdf" element={<Layout><ToolPage toolSlug="reorder-pdf" lang="en" /></Layout>} />
        <Route path="/en/extract-pages" element={<Layout><ToolPage toolSlug="extract-pages" lang="en" /></Layout>} />
        <Route path="/en/ocr-pdf" element={<Layout><ToolPage toolSlug="ocr-pdf" lang="en" /></Layout>} />

        {/* EN Blog */}
        <Route path="/en/blog" element={<Layout><BlogPage /></Layout>} />
        <Route path="/en/blog/:slug" element={<Layout><BlogPostPage /></Layout>} />

        {/* EN Static pages */}
        <Route path="/en/about" element={<Layout><AboutPage /></Layout>} />
        <Route path="/en/contact" element={<Layout><ContactPage /></Layout>} />
        <Route path="/en/sitemap" element={<Layout><SitemapPage /></Layout>} />

        {/* EN Legal */}
        <Route path="/en/privacy-policy" element={<Layout><PrivacyPolicyPage /></Layout>} />
        <Route path="/en/terms" element={<Layout><TermsPage /></Layout>} />
        <Route path="/en/cookie-policy" element={<Layout><CookiePolicyPage /></Layout>} />
        <Route path="/en/dmca" element={<Layout><DMCAPage /></Layout>} />
        <Route path="/en/disclaimer" element={<Layout><DisclaimerPage /></Layout>} />

        {/* ── Spanish routes ── */}
        <Route
          path="/es/"
          element={<Layout><HomePage /></Layout>}
        />

        {/* ES Category pages */}
        <Route path="/es/convertidor-pdf" element={<Layout><CategoryPage categoryId="pdf-converter" /></Layout>} />
        <Route path="/es/imagen-a-pdf" element={<Layout><CategoryPage categoryId="image-to-pdf" /></Layout>} />
        <Route path="/es/herramientas-pdf" element={<Layout><CategoryPage categoryId="pdf-tools" /></Layout>} />
        <Route path="/es/office-a-pdf" element={<Layout><CategoryPage categoryId="office-to-pdf" /></Layout>} />

        {/* ES Tool pages */}
        <Route path="/es/pdf-a-word" element={<Layout><ToolPage toolSlug="pdf-to-word" lang="es" /></Layout>} />
        <Route path="/es/word-a-pdf" element={<Layout><ToolPage toolSlug="word-to-pdf" lang="es" /></Layout>} />
        <Route path="/es/docx-a-pdf" element={<Layout><ToolPage toolSlug="docx-to-pdf" lang="es" /></Layout>} />
        <Route path="/es/excel-a-pdf" element={<Layout><ToolPage toolSlug="excel-to-pdf" lang="es" /></Layout>} />
        <Route path="/es/powerpoint-a-pdf" element={<Layout><ToolPage toolSlug="powerpoint-to-pdf" lang="es" /></Layout>} />
        <Route path="/es/odt-a-pdf" element={<Layout><ToolPage toolSlug="odt-to-pdf" lang="es" /></Layout>} />
        <Route path="/es/rtf-a-pdf" element={<Layout><ToolPage toolSlug="rtf-to-pdf" lang="es" /></Layout>} />
        <Route path="/es/jpg-a-pdf" element={<Layout><ToolPage toolSlug="jpg-to-pdf" lang="es" /></Layout>} />
        <Route path="/es/png-a-pdf" element={<Layout><ToolPage toolSlug="png-to-pdf" lang="es" /></Layout>} />
        <Route path="/es/webp-a-pdf" element={<Layout><ToolPage toolSlug="webp-to-pdf" lang="es" /></Layout>} />
        <Route path="/es/gif-a-pdf" element={<Layout><ToolPage toolSlug="gif-to-pdf" lang="es" /></Layout>} />
        <Route path="/es/svg-a-pdf" element={<Layout><ToolPage toolSlug="svg-to-pdf" lang="es" /></Layout>} />
        <Route path="/es/imagen-a-pdf-multiple" element={<Layout><ToolPage toolSlug="image-to-pdf" lang="es" /></Layout>} />
        <Route path="/es/pdf-a-jpg" element={<Layout><ToolPage toolSlug="pdf-to-jpg" lang="es" /></Layout>} />
        <Route path="/es/pdf-a-png" element={<Layout><ToolPage toolSlug="pdf-to-png" lang="es" /></Layout>} />
        <Route path="/es/pdf-a-texto" element={<Layout><ToolPage toolSlug="pdf-to-text" lang="es" /></Layout>} />
        <Route path="/es/texto-a-pdf" element={<Layout><ToolPage toolSlug="text-to-pdf" lang="es" /></Layout>} />
        <Route path="/es/txt-a-pdf" element={<Layout><ToolPage toolSlug="txt-to-pdf" lang="es" /></Layout>} />
        <Route path="/es/html-a-pdf" element={<Layout><ToolPage toolSlug="html-to-pdf" lang="es" /></Layout>} />
        <Route path="/es/markdown-a-pdf" element={<Layout><ToolPage toolSlug="markdown-to-pdf" lang="es" /></Layout>} />
        <Route path="/es/csv-a-pdf" element={<Layout><ToolPage toolSlug="csv-to-pdf" lang="es" /></Layout>} />
        <Route path="/es/unir-pdf" element={<Layout><ToolPage toolSlug="merge-pdf" lang="es" /></Layout>} />
        <Route path="/es/dividir-pdf" element={<Layout><ToolPage toolSlug="split-pdf" lang="es" /></Layout>} />
        <Route path="/es/comprimir-pdf" element={<Layout><ToolPage toolSlug="compress-pdf" lang="es" /></Layout>} />
        <Route path="/es/rotar-pdf" element={<Layout><ToolPage toolSlug="rotate-pdf" lang="es" /></Layout>} />
        <Route path="/es/proteger-pdf" element={<Layout><ToolPage toolSlug="protect-pdf" lang="es" /></Layout>} />
        <Route path="/es/desbloquear-pdf" element={<Layout><ToolPage toolSlug="unlock-pdf" lang="es" /></Layout>} />
        <Route path="/es/reordenar-pdf" element={<Layout><ToolPage toolSlug="reorder-pdf" lang="es" /></Layout>} />
        <Route path="/es/extraer-paginas" element={<Layout><ToolPage toolSlug="extract-pages" lang="es" /></Layout>} />
        <Route path="/es/ocr-pdf" element={<Layout><ToolPage toolSlug="ocr-pdf" lang="es" /></Layout>} />

        {/* ES Blog */}
        <Route path="/es/blog" element={<Layout><BlogPage /></Layout>} />
        <Route path="/es/blog/:slug" element={<Layout><BlogPostPage /></Layout>} />

        {/* ES Static pages */}
        <Route path="/es/sobre-nosotros" element={<Layout><AboutPage /></Layout>} />
        <Route path="/es/contacto" element={<Layout><ContactPage /></Layout>} />
        <Route path="/es/mapa-del-sitio" element={<Layout><SitemapPage /></Layout>} />

        {/* ES Legal */}
        <Route path="/es/politica-de-privacidad" element={<Layout><PrivacyPolicyPage /></Layout>} />
        <Route path="/es/terminos" element={<Layout><TermsPage /></Layout>} />
        <Route path="/es/politica-de-cookies" element={<Layout><CookiePolicyPage /></Layout>} />
        <Route path="/es/dmca" element={<Layout><DMCAPage /></Layout>} />
        <Route path="/es/aviso-legal" element={<Layout><DisclaimerPage /></Layout>} />

        {/* 404 catch-all */}
        <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
      </Routes>
    </LanguageProvider>
  );
}
