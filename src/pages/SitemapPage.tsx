import { Link } from 'react-router-dom';
import { useTranslation } from '../lib/i18n';
import { tools, categories } from '../lib/toolsConfig';
import SEOHead from '../components/SEOHead';
import Breadcrumbs from '../components/Breadcrumbs';
import { generateMetaTags } from '../lib/seo';

const categoryRoutes: Record<string, { en: string; es: string }> = {
  'pdf-converter': { en: '/en/pdf-converter', es: '/es/convertidor-pdf' },
  'image-to-pdf': { en: '/en/image-to-pdf', es: '/es/imagen-a-pdf' },
  'pdf-tools': { en: '/en/pdf-tools', es: '/es/herramientas-pdf' },
  'office-to-pdf': { en: '/en/office-to-pdf', es: '/es/office-a-pdf' },
};

const legalPages = [
  { en: '/en/privacy-policy', es: '/es/politica-de-privacidad', label: { en: 'Privacy Policy', es: 'Política de Privacidad' } },
  { en: '/en/terms', es: '/es/terminos', label: { en: 'Terms of Use', es: 'Términos de Uso' } },
  { en: '/en/cookie-policy', es: '/es/politica-de-cookies', label: { en: 'Cookie Policy', es: 'Política de Cookies' } },
  { en: '/en/dmca', es: '/es/dmca', label: { en: 'DMCA', es: 'DMCA' } },
  { en: '/en/disclaimer', es: '/es/aviso-legal', label: { en: 'Disclaimer', es: 'Aviso Legal' } },
];

const staticPages = [
  { en: '/en/about', es: '/es/sobre-nosotros', label: { en: 'About Us', es: 'Sobre Nosotros' } },
  { en: '/en/contact', es: '/es/contacto', label: { en: 'Contact', es: 'Contacto' } },
  { en: '/en/blog', es: '/es/blog', label: { en: 'Blog', es: 'Blog' } },
];

export default function SitemapPage() {
  const { lang, t } = useTranslation();
  const meta = generateMetaTags('sitemap', lang);

  return (
    <>
      <SEOHead meta={meta} />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs />

        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {lang === 'en' ? 'Site Map' : 'Mapa del Sitio'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-10">
          {lang === 'en'
            ? 'A complete list of all pages and tools available on ConvertFlow.'
            : 'Lista completa de todas las páginas y herramientas disponibles en ConvertFlow.'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Tools by category */}
          {categories.map((cat) => {
            const catTools = tools.filter((tool) => tool.category === cat.id);
            const route = categoryRoutes[cat.id];
            return (
              <section key={cat.id}>
                <Link
                  to={lang === 'en' ? route.en : route.es}
                  className="block text-lg font-bold text-primary-600 dark:text-primary-400 hover:underline mb-3"
                >
                  {t(cat.labelKey)}
                </Link>
                <ul className="space-y-1.5">
                  {catTools.map((tool) => (
                    <li key={tool.id}>
                      <Link
                        to={`/${lang}/${tool.slug[lang]}`}
                        className="text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:underline flex items-center gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
                        {t(`tools.${tool.id}.name`)}
                        {!tool.available && (
                          <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">
                            ({t('common.comingSoon')})
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}

          {/* Static pages */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
              {lang === 'en' ? 'Pages' : 'Páginas'}
            </h2>
            <ul className="space-y-1.5">
              {staticPages.map((page) => (
                <li key={page.en}>
                  <Link
                    to={lang === 'en' ? page.en : page.es}
                    className="text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:underline flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                    {page.label[lang]}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Legal pages */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
              {lang === 'en' ? 'Legal' : 'Legal'}
            </h2>
            <ul className="space-y-1.5">
              {legalPages.map((page) => (
                <li key={page.en}>
                  <Link
                    to={lang === 'en' ? page.en : page.es}
                    className="text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:underline flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                    {page.label[lang]}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </>
  );
}
