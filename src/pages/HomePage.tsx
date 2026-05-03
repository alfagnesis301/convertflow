import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, Search, Upload, Zap, Download, CheckCircle,
  ArrowLeftRight, Images, Wrench, Briefcase,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '../lib/i18n';
import { tools, categories } from '../lib/toolsConfig';
import { generateMetaTags } from '../lib/seo';
import SEOHead from '../components/SEOHead';
import ToolGrid from '../components/ToolGrid';
import TrustSection from '../components/TrustSection';
import FAQSection from '../components/FAQSection';
import BlogCard from '../components/BlogCard';
import { blogPostsEn } from '../content/blog.en';
import { blogPostsEs } from '../content/blog.es';

const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  ArrowLeftRight, Images, Wrench, Briefcase,
};
function getIcon(name: string): LucideIcon {
  return CATEGORY_ICON_MAP[name] ?? ArrowRight;
}

const popularToolIds = [
  'pdf-to-word',
  'merge-pdf',
  'compress-pdf',
  'jpg-to-pdf',
  'split-pdf',
  'rotate-pdf',
];

const categoryColors: Record<string, { bg: string; from: string; to: string; icon: string }> = {
  'pdf-converter': {
    bg: 'from-blue-500 to-blue-600',
    from: 'bg-blue-50 dark:bg-blue-950/40',
    to: 'text-blue-600 dark:text-blue-400',
    icon: 'ArrowLeftRight',
  },
  'image-to-pdf': {
    bg: 'from-emerald-500 to-emerald-600',
    from: 'bg-emerald-50 dark:bg-emerald-950/40',
    to: 'text-emerald-600 dark:text-emerald-400',
    icon: 'Images',
  },
  'pdf-tools': {
    bg: 'from-violet-500 to-violet-600',
    from: 'bg-violet-50 dark:bg-violet-950/40',
    to: 'text-violet-600 dark:text-violet-400',
    icon: 'Wrench',
  },
  'office-to-pdf': {
    bg: 'from-orange-500 to-orange-600',
    from: 'bg-orange-50 dark:bg-orange-950/40',
    to: 'text-orange-600 dark:text-orange-400',
    icon: 'Briefcase',
  },
};

const categoryRoutes: Record<string, { en: string; es: string }> = {
  'pdf-converter': { en: '/en/pdf-converter', es: '/es/convertidor-pdf' },
  'image-to-pdf': { en: '/en/image-to-pdf', es: '/es/imagen-a-pdf' },
  'pdf-tools': { en: '/en/pdf-tools', es: '/es/herramientas-pdf' },
  'office-to-pdf': { en: '/en/office-to-pdf', es: '/es/office-a-pdf' },
};

const categoryDescriptions: Record<string, { en: string; es: string }> = {
  'pdf-converter': {
    en: 'Convert PDF to Word, JPG, PNG, and more formats.',
    es: 'Convierte PDF a Word, JPG, PNG y más formatos.',
  },
  'image-to-pdf': {
    en: 'Turn JPG, PNG, WebP, and SVG images into PDF files.',
    es: 'Convierte imágenes JPG, PNG, WebP y SVG a PDF.',
  },
  'pdf-tools': {
    en: 'Merge, split, compress, rotate, protect and more.',
    es: 'Une, divide, comprime, rota, protege y más.',
  },
  'office-to-pdf': {
    en: 'Convert Word, Excel, PowerPoint, and more to PDF.',
    es: 'Convierte Word, Excel, PowerPoint y más a PDF.',
  },
};

export default function HomePage() {
  const { t, lang } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const meta = generateMetaTags('home', lang);

  const popularTools = popularToolIds
    .map((id) => tools.find((tool) => tool.id === id))
    .filter((t): t is NonNullable<typeof t> => t !== undefined);

  const faqItems = (t('home.faqItems') as unknown as { q: string; a: string }[]) ?? [];
  const faqs = faqItems.map((item) => ({ question: item.q, answer: item.a }));

  const posts = lang === 'en' ? blogPostsEn.slice(0, 3) : blogPostsEs.slice(0, 3);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    // Find matching tool
    const q = search.toLowerCase();
    const match = tools.find(
      (tool) =>
        t(`tools.${tool.id}.name`).toLowerCase().includes(q) ||
        tool.id.includes(q)
    );
    if (match) {
      navigate(`/${lang}/${match.slug[lang]}`);
    }
  };

  const howItWorksSteps = [
    { icon: Upload, title: lang === 'en' ? 'Upload your file' : 'Sube tu archivo', desc: lang === 'en' ? 'Select or drag & drop your file. We support PDF, Word, Excel, images, and more.' : 'Selecciona o arrastra tu archivo. Soportamos PDF, Word, Excel, imágenes y más.' },
    { icon: Zap, title: lang === 'en' ? 'Convert instantly' : 'Conversión instantánea', desc: lang === 'en' ? 'Our server processes your file in seconds using trusted open-source libraries.' : 'Nuestro servidor procesa tu archivo en segundos con librerías de código abierto.' },
    { icon: Download, title: lang === 'en' ? 'Download the result' : 'Descarga el resultado', desc: lang === 'en' ? 'Your converted file is ready to download. Files are deleted after 30 minutes.' : 'Tu archivo convertido está listo para descargar. Se elimina en 30 minutos.' },
  ];

  const whyUsPoints = [
    { icon: CheckCircle, title: lang === 'en' ? '100% Free' : '100% Gratis', desc: lang === 'en' ? 'All core tools are free, with no hidden fees or watermarks.' : 'Todas las herramientas son gratuitas, sin tarifas ocultas ni marcas de agua.' },
    { icon: CheckCircle, title: lang === 'en' ? 'Privacy First' : 'Privacidad ante todo', desc: lang === 'en' ? 'Files are deleted automatically. We never read or share your documents.' : 'Los archivos se eliminan automáticamente. Nunca leemos ni compartimos tus documentos.' },
    { icon: CheckCircle, title: lang === 'en' ? 'No Account Needed' : 'Sin cuenta necesaria', desc: lang === 'en' ? 'Just upload, convert, and download. No sign-up, ever.' : 'Solo sube, convierte y descarga. Sin registro.' },
    { icon: CheckCircle, title: lang === 'en' ? 'Works Everywhere' : 'Funciona en todas partes', desc: lang === 'en' ? 'Use ConvertFlow on any device — desktop, tablet, or mobile.' : 'Usa ConvertFlow en cualquier dispositivo — escritorio, tablet o móvil.' },
  ];

  return (
    <>
      <SEOHead meta={meta} />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-violet-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 pt-16 pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block text-sm font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/50 border border-primary-200 dark:border-primary-800 px-4 py-1.5 rounded-full mb-6">
                {t('common.freeOnline')} · {t('common.noRegistration')} · {t('common.secureFast')}
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight mb-6">
                {lang === 'en' ? (
                  <>Free and Easy <span className="gradient-text">PDF Tools</span> Online</>
                ) : (
                  <>Herramientas <span className="gradient-text">PDF Gratis</span> y Fáciles Online</>
                )}
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
                {t('home.intro')}
              </p>

              {/* Search */}
              <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-lg mx-auto mb-8">
                <div className="relative flex-1">
                  <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={lang === 'en' ? 'Search tools...' : 'Buscar herramientas...'}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-400"
                  />
                </div>
                <button type="submit" className="btn-primary shrink-0">
                  {lang === 'en' ? 'Find' : 'Buscar'}
                </button>
              </form>

              <div className="flex flex-wrap justify-center gap-3">
                <Link to={`/${lang}/`} className="btn-primary">
                  {t('home.heroCtaMain')}
                  <ArrowRight size={18} />
                </Link>
                <Link to={lang === 'en' ? '/en/pdf-tools' : '/es/herramientas-pdf'} className="btn-secondary">
                  {t('home.heroCtaSecondary')}
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Decorative blur orbs */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary-200/40 dark:bg-primary-900/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-violet-200/40 dark:bg-violet-900/20 rounded-full blur-3xl pointer-events-none" />
        </section>

        {/* Popular tools */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('home.popularTools')}</h2>
            <Link
              to={lang === 'en' ? '/en/pdf-tools' : '/es/herramientas-pdf'}
              className="flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
            >
              {t('common.allTools')} <ArrowRight size={14} />
            </Link>
          </div>
          <ToolGrid tools={popularTools} />
        </section>

        {/* Categories */}
        <section className="bg-gray-50 dark:bg-gray-900/50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
              {lang === 'en' ? 'Browse by Category' : 'Explorar por categoría'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {categories.map((cat) => {
                const colors = categoryColors[cat.id];
                const Icon = getIcon(colors.icon);
                const route = categoryRoutes[cat.id];
                const desc = categoryDescriptions[cat.id][lang];
                const toolCount = tools.filter((t) => t.category === cat.id).length;
                return (
                  <Link
                    key={cat.id}
                    to={lang === 'en' ? route.en : route.es}
                    className="group flex flex-col items-start gap-4 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${colors.bg} text-white shadow-sm`}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {t(cat.labelKey)}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
                    </div>
                    <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                      {toolCount} {lang === 'en' ? 'tools' : 'herramientas'}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Trust section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TrustSection />
        </div>

        {/* How it works */}
        <section className="bg-gray-50 dark:bg-gray-900/50 py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-12 text-center">
              {t('home.howItWorks')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {howItWorksSteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="text-center flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-lg">
                        <Icon size={26} className="text-white" />
                      </div>
                      <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{step.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why ConvertFlow */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-10 text-center">
            {t('home.whyUs')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUsPoints.map((point, i) => {
              const Icon = point.icon;
              return (
                <div key={i} className="flex flex-col items-center text-center gap-3 p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                  <Icon size={24} className="text-green-500" />
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{point.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{point.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* FAQ */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={faqs} title={t('home.faq')} />
        </div>

        {/* Blog preview */}
        {posts.length > 0 && (
          <section className="bg-gray-50 dark:bg-gray-900/50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {lang === 'en' ? 'From the Blog' : 'Del Blog'}
                </h2>
                <Link
                  to={`/${lang}/blog`}
                  className="flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
                >
                  {lang === 'en' ? 'All articles' : 'Todos los artículos'} <ArrowRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {lang === 'en' ? 'Ready to get started?' : '¿Listo para empezar?'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            {lang === 'en'
              ? 'Join thousands of users who convert their files with ConvertFlow every day.'
              : 'Únete a miles de usuarios que convierten sus archivos con ConvertFlow cada día.'}
          </p>
          <Link to={`/${lang}/pdf-tools`} className="btn-primary text-base px-8 py-4">
            {t('home.heroCtaMain')}
            <ArrowRight size={20} />
          </Link>
        </section>
      </main>
    </>
  );
}
