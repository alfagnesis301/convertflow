import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useTranslation } from '../lib/i18n';
import Logo from './Logo';

export default function Footer() {
  const { t, lang } = useTranslation();
  const year = new Date().getFullYear();

  const col2Tools = [
    { label: t('tools.merge-pdf.name'), to: lang === 'en' ? '/en/merge-pdf' : '/es/unir-pdf' },
    { label: t('tools.split-pdf.name'), to: lang === 'en' ? '/en/split-pdf' : '/es/dividir-pdf' },
    { label: t('tools.compress-pdf.name'), to: lang === 'en' ? '/en/compress-pdf' : '/es/comprimir-pdf' },
    { label: t('tools.rotate-pdf.name'), to: lang === 'en' ? '/en/rotate-pdf' : '/es/rotar-pdf' },
    { label: t('tools.protect-pdf.name'), to: lang === 'en' ? '/en/protect-pdf' : '/es/proteger-pdf' },
    { label: t('tools.unlock-pdf.name'), to: lang === 'en' ? '/en/unlock-pdf' : '/es/desbloquear-pdf' },
    { label: t('tools.ocr-pdf.name'), to: lang === 'en' ? '/en/ocr-pdf' : '/es/ocr-pdf' },
  ];

  const col3Convert = [
    { label: t('tools.pdf-to-word.name'), to: lang === 'en' ? '/en/pdf-to-word' : '/es/pdf-a-word' },
    { label: t('tools.word-to-pdf.name'), to: lang === 'en' ? '/en/word-to-pdf' : '/es/word-a-pdf' },
    { label: t('tools.jpg-to-pdf.name'), to: lang === 'en' ? '/en/jpg-to-pdf' : '/es/jpg-a-pdf' },
    { label: t('tools.pdf-to-jpg.name'), to: lang === 'en' ? '/en/pdf-to-jpg' : '/es/pdf-a-jpg' },
    { label: t('tools.excel-to-pdf.name'), to: lang === 'en' ? '/en/excel-to-pdf' : '/es/excel-a-pdf' },
    { label: t('tools.powerpoint-to-pdf.name'), to: lang === 'en' ? '/en/powerpoint-to-pdf' : '/es/powerpoint-a-pdf' },
    { label: t('tools.html-to-pdf.name'), to: lang === 'en' ? '/en/html-to-pdf' : '/es/html-a-pdf' },
  ];

  const col4Company = [
    { label: t('legal.about'), to: lang === 'en' ? '/en/about' : '/es/sobre-nosotros' },
    { label: t('nav.contact'), to: lang === 'en' ? '/en/contact' : '/es/contacto' },
    { label: t('nav.blog'), to: `/${lang}/blog` },
    { label: t('legal.privacy'), to: lang === 'en' ? '/en/privacy-policy' : '/es/politica-de-privacidad' },
    { label: t('legal.terms'), to: lang === 'en' ? '/en/terms' : '/es/terminos' },
    { label: t('legal.cookie'), to: lang === 'en' ? '/en/cookie-policy' : '/es/politica-de-cookies' },
    { label: t('legal.dmca'), to: lang === 'en' ? '/en/dmca' : '/es/dmca' },
    { label: lang === 'en' ? 'Sitemap' : 'Mapa del sitio', to: lang === 'en' ? '/en/sitemap' : '/es/mapa-del-sitio' },
  ];

  const linkClass =
    'text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm';

  return (
    <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1 – Brand */}
          <div className="space-y-4">
            <Link to={`/${lang}/`}>
              <Logo size="sm" />
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {t('footer.tagline')}
            </p>
            <div className="flex items-start gap-2 text-xs text-gray-400 dark:text-gray-500">
              <Shield size={14} className="shrink-0 mt-0.5 text-green-500" />
              <span>{t('common.filePrivacyNotice')}</span>
            </div>
          </div>

          {/* Column 2 – PDF Tools */}
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">
              {lang === 'en' ? 'PDF Tools' : 'Herramientas PDF'}
            </p>
            <ul className="space-y-2">
              {col2Tools.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 – Convert */}
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">
              {lang === 'en' ? 'Convert' : 'Convertir'}
            </p>
            <ul className="space-y-2">
              {col3Convert.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 – Company */}
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">
              {t('footer.company.title')}
            </p>
            <ul className="space-y-2">
              {col4Company.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-400 dark:text-gray-500">
          <p>{t('footer.copyright', { year: String(year) })}</p>
          <div className="flex items-center gap-4">
            <Link
              to={lang === 'en' ? '/en/privacy-policy' : '/es/politica-de-privacidad'}
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {t('legal.privacy')}
            </Link>
            <Link
              to={lang === 'en' ? '/en/terms' : '/es/terminos'}
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {t('legal.terms')}
            </Link>
            <Link
              to={lang === 'en' ? '/en/cookie-policy' : '/es/politica-de-cookies'}
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {t('legal.cookie')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
