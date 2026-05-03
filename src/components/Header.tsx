import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  ChevronDown,
  Sun,
  Moon,
  Globe,
  FileText,
  Scissors,
  GitMerge,
  PackageOpen,
  RotateCw,
  Lock,
  Unlock,
  Image,
  ArrowLeftRight,
  Wrench,
  Briefcase,
} from 'lucide-react';
import { useTranslation } from '../lib/i18n';
import Logo from './Logo';

const categoryLinks = [
  {
    labelKey: 'categories.pdfConverter',
    icon: ArrowLeftRight,
    en: '/en/pdf-converter',
    es: '/es/convertidor-pdf',
  },
  {
    labelKey: 'categories.imageToPdf',
    icon: Image,
    en: '/en/image-to-pdf',
    es: '/es/imagen-a-pdf',
  },
  {
    labelKey: 'categories.pdfTools',
    icon: Wrench,
    en: '/en/pdf-tools',
    es: '/es/herramientas-pdf',
  },
  {
    labelKey: 'categories.officeToPdf',
    icon: Briefcase,
    en: '/en/office-to-pdf',
    es: '/es/office-a-pdf',
  },
];

const popularToolLinks = [
  { nameKey: 'tools.pdf-to-word.name', icon: FileText, en: '/en/pdf-to-word', es: '/es/pdf-a-word' },
  { nameKey: 'tools.merge-pdf.name', icon: GitMerge, en: '/en/merge-pdf', es: '/es/unir-pdf' },
  { nameKey: 'tools.split-pdf.name', icon: Scissors, en: '/en/split-pdf', es: '/es/dividir-pdf' },
  { nameKey: 'tools.compress-pdf.name', icon: PackageOpen, en: '/en/compress-pdf', es: '/es/comprimir-pdf' },
  { nameKey: 'tools.rotate-pdf.name', icon: RotateCw, en: '/en/rotate-pdf', es: '/es/rotar-pdf' },
  { nameKey: 'tools.protect-pdf.name', icon: Lock, en: '/en/protect-pdf', es: '/es/proteger-pdf' },
  { nameKey: 'tools.unlock-pdf.name', icon: Unlock, en: '/en/unlock-pdf', es: '/es/desbloquear-pdf' },
];

function useTheme() {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (
      localStorage.getItem('cf-theme') === 'dark' ||
      (!localStorage.getItem('cf-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('cf-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('cf-theme', 'light');
    }
  }, [dark]);

  return { dark, toggle: () => setDark((d) => !d) };
}

export default function Header() {
  const { t, lang, setLang } = useTranslation();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { dark, toggle: toggleTheme } = useTheme();

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setToolsOpen(false);
  }, [location.pathname]);

  const navLink = (enPath: string, esPath: string, label: string) => {
    const path = lang === 'en' ? enPath : esPath;
    const isActive = location.pathname === path;
    return (
      <Link
        to={path}
        className={`text-sm font-medium transition-colors hover:text-primary-600 dark:hover:text-primary-400 ${
          isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'
        }`}
      >
        {label}
      </Link>
    );
  };

  const switchLang = () => {
    const newLang = lang === 'en' ? 'es' : 'en';
    setLang(newLang);
    // Navigate to same page in new language
    const currentPath = location.pathname;
    const langSwitchMap: Record<string, string> = {
      '/en/': '/es/',
      '/es/': '/en/',
      '/en/pdf-converter': '/es/convertidor-pdf',
      '/es/convertidor-pdf': '/en/pdf-converter',
      '/en/image-to-pdf': '/es/imagen-a-pdf',
      '/es/imagen-a-pdf': '/en/image-to-pdf',
      '/en/pdf-tools': '/es/herramientas-pdf',
      '/es/herramientas-pdf': '/en/pdf-tools',
      '/en/office-to-pdf': '/es/office-a-pdf',
      '/es/office-a-pdf': '/en/office-to-pdf',
      '/en/blog': '/es/blog',
      '/es/blog': '/en/blog',
      '/en/about': '/es/sobre-nosotros',
      '/es/sobre-nosotros': '/en/about',
      '/en/contact': '/es/contacto',
      '/es/contacto': '/en/contact',
    };
    const target = langSwitchMap[currentPath] ?? `/${newLang}/`;
    window.location.href = target;
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={`/${lang}/`} aria-label="FlowToPDF Home">
            <Logo size="sm" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {/* Tools Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setToolsOpen((o) => !o)}
                className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-expanded={toolsOpen}
                aria-haspopup="true"
              >
                {t('nav.tools')}
                <ChevronDown
                  size={15}
                  className={`transition-transform duration-200 ${toolsOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {toolsOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[520px] bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-5 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                      {t('nav.tools')} by Category
                    </p>
                    {categoryLinks.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <Link
                          key={cat.en}
                          to={lang === 'en' ? cat.en : cat.es}
                          className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 transition-colors"
                        >
                          <Icon size={15} className="text-primary-500 shrink-0" />
                          {t(cat.labelKey)}
                        </Link>
                      );
                    })}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                      Popular
                    </p>
                    {popularToolLinks.map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <Link
                          key={tool.en}
                          to={lang === 'en' ? tool.en : tool.es}
                          className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 transition-colors"
                        >
                          <Icon size={15} className="text-violet-500 shrink-0" />
                          {t(tool.nameKey)}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {navLink('/en/blog', '/es/blog', t('nav.blog'))}
            {navLink('/en/about', '/es/sobre-nosotros', t('nav.about'))}
            {navLink('/en/contact', '/es/contacto', t('nav.contact'))}
          </nav>

          {/* Right controls */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={switchLang}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={t('nav.language')}
            >
              <Globe size={15} />
              <span>{lang === 'en' ? 'ES' : 'EN'}</span>
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 pb-4 pt-2 animate-slide-up">
          <nav className="space-y-1">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider pt-2 pb-1">
              Categories
            </p>
            {categoryLinks.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.en}
                  to={lang === 'en' ? cat.en : cat.es}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-sm text-gray-700 dark:text-gray-300"
                >
                  <Icon size={16} className="text-primary-500 shrink-0" />
                  {t(cat.labelKey)}
                </Link>
              );
            })}

            <div className="border-t border-gray-100 dark:border-gray-800 my-2" />

            <Link
              to={`/${lang}/blog`}
              className="block px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-sm text-gray-700 dark:text-gray-300"
            >
              {t('nav.blog')}
            </Link>
            <Link
              to={lang === 'en' ? '/en/about' : '/es/sobre-nosotros'}
              className="block px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-sm text-gray-700 dark:text-gray-300"
            >
              {t('nav.about')}
            </Link>
            <Link
              to={lang === 'en' ? '/en/contact' : '/es/contacto'}
              className="block px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-sm text-gray-700 dark:text-gray-300"
            >
              {t('nav.contact')}
            </Link>

            <div className="border-t border-gray-100 dark:border-gray-800 my-2" />

            <div className="flex items-center gap-2 px-3 py-2">
              <button
                onClick={switchLang}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Globe size={15} />
                <span>{lang === 'en' ? 'Español' : 'English'}</span>
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
