/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENABLE_ADSENSE: string;
  readonly VITE_ADSENSE_CLIENT_ID: string;
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_GA_MEASUREMENT_ID: string;
  readonly VITE_SUPPORT_EMAIL: string;
  readonly VITE_SITE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
