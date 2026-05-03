import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cookie, ToggleLeft, ToggleRight } from 'lucide-react';
import { useTranslation } from '../lib/i18n';
import { Link } from 'react-router-dom';

type ConsentValue = 'all' | 'essential' | 'rejected';

interface Preferences {
  analytics: boolean;
  advertising: boolean;
}

const STORAGE_KEY = 'cf-cookie-consent';

export function getCookieConsent(): ConsentValue | null {
  try {
    return localStorage.getItem(STORAGE_KEY) as ConsentValue | null;
  } catch {
    return null;
  }
}

export default function CookieBanner() {
  const { t, lang } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [prefs, setPrefs] = useState<Preferences>({ analytics: true, advertising: false });

  useEffect(() => {
    const stored = getCookieConsent();
    if (!stored) {
      // Show after short delay
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const save = (value: ConsentValue) => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore
    }
    setVisible(false);
    setShowPrefs(false);
  };

  const acceptAll = () => save('all');
  const rejectNonEssential = () => save('rejected');
  const savePreferences = () => {
    const value: ConsentValue = prefs.analytics || prefs.advertising ? 'essential' : 'rejected';
    // Store custom prefs separately
    try {
      localStorage.setItem('cf-cookie-prefs', JSON.stringify(prefs));
    } catch {
      // ignore
    }
    save(value);
  };

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-4 left-4 right-4 z-50 max-w-2xl mx-auto"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-5">
              <div className="flex items-start gap-3">
                <Cookie size={20} className="text-primary-500 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t('cookie.banner')}{' '}
                    <Link
                      to={lang === 'en' ? '/en/cookie-policy' : '/es/politica-de-cookies'}
                      className="text-primary-600 dark:text-primary-400 underline hover:no-underline"
                    >
                      {t('cookie.moreInfo')}
                    </Link>
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <button onClick={acceptAll} className="btn-primary py-2 px-4 text-sm">
                      {t('cookie.accept')}
                    </button>
                    <button
                      onClick={rejectNonEssential}
                      className="btn-secondary py-2 px-4 text-sm"
                    >
                      {t('cookie.reject')}
                    </button>
                    <button
                      onClick={() => setShowPrefs(true)}
                      className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline transition-colors"
                    >
                      {t('cookie.manage')}
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => save('essential')}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 shrink-0"
                  aria-label="Dismiss"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preferences Modal */}
      <AnimatePresence>
        {showPrefs && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowPrefs(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {t('cookie.manage')}
                </h2>
                <button
                  onClick={() => setShowPrefs(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Essential (always on) */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {lang === 'en' ? 'Essential Cookies' : 'Cookies esenciales'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {lang === 'en'
                        ? 'Required for the site to function.'
                        : 'Necesarias para el funcionamiento del sitio.'}
                    </p>
                  </div>
                  <ToggleRight size={28} className="text-green-500 shrink-0" />
                </div>

                {/* Analytics */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {lang === 'en' ? 'Analytics Cookies' : 'Cookies analíticas'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {lang === 'en'
                        ? 'Help us understand how visitors use the site.'
                        : 'Nos ayudan a entender cómo los usuarios usan el sitio.'}
                    </p>
                  </div>
                  <button
                    onClick={() => setPrefs((p) => ({ ...p, analytics: !p.analytics }))}
                    className="shrink-0"
                    aria-label="Toggle analytics"
                  >
                    {prefs.analytics ? (
                      <ToggleRight size={28} className="text-primary-500" />
                    ) : (
                      <ToggleLeft size={28} className="text-gray-300 dark:text-gray-600" />
                    )}
                  </button>
                </div>

                {/* Advertising */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {lang === 'en' ? 'Advertising Cookies' : 'Cookies publicitarias'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {lang === 'en'
                        ? 'Used to show relevant ads that support our free service.'
                        : 'Usadas para mostrar anuncios relevantes que financian el servicio gratuito.'}
                    </p>
                  </div>
                  <button
                    onClick={() => setPrefs((p) => ({ ...p, advertising: !p.advertising }))}
                    className="shrink-0"
                    aria-label="Toggle advertising"
                  >
                    {prefs.advertising ? (
                      <ToggleRight size={28} className="text-primary-500" />
                    ) : (
                      <ToggleLeft size={28} className="text-gray-300 dark:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={savePreferences} className="btn-primary flex-1 justify-center py-2.5">
                  {lang === 'en' ? 'Save preferences' : 'Guardar preferencias'}
                </button>
                <button onClick={acceptAll} className="btn-secondary flex-1 justify-center py-2.5">
                  {t('cookie.accept')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
