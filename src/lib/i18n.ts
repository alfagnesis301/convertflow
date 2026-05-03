import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  createElement,
} from 'react';

export type Lang = 'en' | 'es';

const STORAGE_KEY = 'cf-lang';
const SUPPORTED_LANGS: Lang[] = ['en', 'es'];

// ─── Translation data ────────────────────────────────────────────────────────

// Static imports — always bundled (locales are small, ~10KB each)
import enRaw from '../locales/en.json';
import esRaw from '../locales/es.json';

const staticTranslations: Record<Lang, Record<string, unknown>> = {
  en: enRaw as unknown as Record<string, unknown>,
  es: esRaw as unknown as Record<string, unknown>,
};

// ─── t() helper ─────────────────────────────────────────────────────────────

/**
 * Resolve a dot-separated key path against a nested object.
 * Returns the key itself as a fallback string if not found.
 */
function resolve(obj: Record<string, unknown>, key: string): string {
  const parts = key.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current === null || typeof current !== 'object') return key;
    current = (current as Record<string, unknown>)[part];
  }
  if (typeof current === 'string') return current;
  return key;
}

/**
 * Resolve a key path returning the raw value (string, array, object, etc.).
 * Use this when the translation entry is not a plain string (e.g. FAQ arrays).
 */
function resolveRaw(obj: Record<string, unknown>, key: string): unknown {
  const parts = key.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current === null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

/**
 * Get the raw translation value (array, object, etc.) for a given key.
 * Falls back to English if the key is missing in the requested language.
 */
export function tRaw<T = unknown>(key: string, lang: Lang = getCurrentLang()): T | undefined {
  const dict = staticTranslations[lang] ?? staticTranslations['en'];
  let value = resolveRaw(dict, key);
  if (value === undefined && lang !== 'en') {
    value = resolveRaw(staticTranslations['en'], key);
  }
  return value as T | undefined;
}

/**
 * Translate a dot-separated key with optional interpolation variables.
 *
 * @example
 *   t('errors.fileTooLarge', { size: '50' }, 'en')
 *   // => "The file exceeds the maximum allowed size of 50 MB."
 */
export function t(
  key: string,
  vars?: Record<string, string | number>,
  lang: Lang = getCurrentLang()
): string {
  const dict = staticTranslations[lang] ?? staticTranslations['en'];
  let value = resolve(dict, key);

  // Fall back to English if key not found in requested language
  if (value === key && lang !== 'en') {
    value = resolve(staticTranslations['en'], key);
  }

  if (vars) {
    value = value.replace(/\{\{(\w+)\}\}/g, (_, name) =>
      vars[name] !== undefined ? String(vars[name]) : `{{${name}}}`
    );
  }

  return value;
}

// ─── Language detection ──────────────────────────────────────────────────────

/**
 * Detect language from (in priority order):
 *  1. URL path prefix  (/en/... or /es/...)
 *  2. localStorage preference
 *  3. Browser navigator.language
 *  4. Fallback: 'en'
 */
export function detectLang(): Lang {
  // 1. URL path
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname;
    const match = pathname.match(/^\/(en|es)(\/|$)/);
    if (match) return match[1] as Lang;
  }

  // 2. localStorage
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LANGS.includes(stored as Lang)) {
      return stored as Lang;
    }
  } catch {
    // localStorage not available (e.g. incognito strict mode)
  }

  // 3. Browser language
  if (typeof navigator !== 'undefined') {
    const browserLang = navigator.language.slice(0, 2).toLowerCase();
    if (SUPPORTED_LANGS.includes(browserLang as Lang)) {
      return browserLang as Lang;
    }
  }

  // 4. Default
  return 'en';
}

export function getCurrentLang(): Lang {
  return detectLang();
}

export function saveLangPreference(lang: Lang): void {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // ignore
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

export const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => undefined,
  t: (key) => key,
});

// ─── Provider ────────────────────────────────────────────────────────────────

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [lang, setLangState] = useState<Lang>(detectLang);

  // Re-detect when URL changes (e.g. after navigation)
  useEffect(() => {
    const handler = () => {
      const detected = detectLang();
      if (detected !== lang) setLangState(detected);
    };
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, [lang]);

  function setLang(newLang: Lang) {
    setLangState(newLang);
    saveLangPreference(newLang);
  }

  function translate(key: string, vars?: Record<string, string | number>): string {
    return t(key, vars, lang);
  }

  return createElement(
    LanguageContext.Provider,
    { value: { lang, setLang, t: translate } },
    children
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useTranslation must be used inside <LanguageProvider>');
  }
  return ctx;
}
