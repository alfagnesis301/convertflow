import { Link } from 'react-router-dom';
import { useTranslation } from '../lib/i18n';
import { FileX, Home, Search } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { generateMetaTags } from '../lib/seo';

export default function NotFoundPage() {
  const { lang } = useTranslation();
  const meta = generateMetaTags('home', lang); // fallback to home meta

  const title404 =
    lang === 'en' ? '404 – Page Not Found | FlowToPDF' : '404 – Página no encontrada | FlowToPDF';

  return (
    <>
      <SEOHead meta={{ ...meta, title: title404, ogTitle: title404 }} />
      <main className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500 to-violet-600 text-white mb-8 shadow-lg">
            <FileX size={40} />
          </div>

          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">404</h1>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            {lang === 'en' ? 'Page not found' : 'Página no encontrada'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">
            {lang === 'en'
              ? "The page you are looking for doesn't exist or has been moved. Check the URL or browse our tools below."
              : 'La página que buscas no existe o ha sido movida. Revisa la URL o explora nuestras herramientas.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={`/${lang}/`} className="btn-primary">
              <Home size={18} />
              {lang === 'en' ? 'Go to Home' : 'Ir al Inicio'}
            </Link>
            <Link
              to={lang === 'en' ? '/en/pdf-tools' : '/es/herramientas-pdf'}
              className="btn-secondary"
            >
              <Search size={18} />
              {lang === 'en' ? 'Browse Tools' : 'Ver Herramientas'}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
