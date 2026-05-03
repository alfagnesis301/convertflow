import { useTranslation } from '../../lib/i18n';
import { generateMetaTags } from '../../lib/seo';
import SEOHead from '../../components/SEOHead';
import Breadcrumbs from '../../components/Breadcrumbs';

export default function CookiePolicyPage() {
  const { lang } = useTranslation();
  const meta = generateMetaTags('home', lang);
  const isEn = lang === 'en';

  const cookieMeta = {
    ...meta,
    title: isEn ? 'Cookie Policy | ConvertFlow' : 'Política de Cookies | ConvertFlow',
    description: isEn
      ? 'Learn about the cookies ConvertFlow uses and how to manage them.'
      : 'Conoce las cookies que usa ConvertFlow y cómo gestionarlas.',
  };

  return (
    <>
      <SEOHead meta={cookieMeta} />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />

        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {isEn ? 'Cookie Policy' : 'Política de Cookies'}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-10">
          {isEn ? 'Last updated: May 2025' : 'Última actualización: mayo 2025'}
        </p>

        <div className="space-y-8 text-gray-600 dark:text-gray-400">
          {isEn ? (
            <>
              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">What Are Cookies?</h2>
                <p>Cookies are small text files placed on your device by websites you visit. They are widely used to make websites work efficiently and provide information to site owners.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Cookies We Use</h2>

                <div className="space-y-4">
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Essential Cookies</h3>
                    <p className="text-sm">These are required for the site to function. They cannot be disabled.</p>
                    <ul className="list-disc ml-6 text-sm mt-2 space-y-1">
                      <li><code className="text-primary-600 dark:text-primary-400">cf-lang</code> — stores your language preference (en/es)</li>
                      <li><code className="text-primary-600 dark:text-primary-400">cf-theme</code> — stores your light/dark mode preference</li>
                      <li><code className="text-primary-600 dark:text-primary-400">cf-cookie-consent</code> — remembers your cookie choices</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Analytics Cookies (Optional)</h3>
                    <p className="text-sm">Only set if you consent. We use Google Analytics to understand anonymous usage patterns. These cookies help us improve the service.</p>
                    <ul className="list-disc ml-6 text-sm mt-2 space-y-1">
                      <li><code className="text-primary-600 dark:text-primary-400">_ga</code>, <code className="text-primary-600 dark:text-primary-400">_ga_*</code> — Google Analytics identifiers</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Advertising Cookies (Optional)</h3>
                    <p className="text-sm">Only set if you consent. Google AdSense may set cookies to show relevant ads. These are third-party cookies managed by Google.</p>
                    <ul className="list-disc ml-6 text-sm mt-2 space-y-1">
                      <li>Google AdSense cookies (set by Google, not us)</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Third-Party Cookies</h2>
                <p>When advertising is enabled, Google may set cookies through our site. We have no control over those cookies. You can review <a href="https://policies.google.com/technologies/cookies" className="text-primary-600 dark:text-primary-400 underline" target="_blank" rel="noopener noreferrer">Google's cookie policy</a> for more information.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">How to Manage Cookies</h2>
                <p>You can manage your cookie preferences in several ways:</p>
                <ul className="list-disc ml-6 space-y-1 mt-2">
                  <li>Use the cookie banner on your first visit to set preferences</li>
                  <li>Clear your browser cookies to reset all preferences</li>
                  <li>Use your browser's privacy settings to block third-party cookies</li>
                  <li>Opt out of Google's ad personalization at <a href="https://adssettings.google.com" className="text-primary-600 dark:text-primary-400 underline" target="_blank" rel="noopener noreferrer">adssettings.google.com</a></li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Contact</h2>
                <p>Questions? Email <a href="mailto:support@flowtopdf.com" className="text-primary-600 dark:text-primary-400 underline">support@flowtopdf.com</a></p>
              </section>
            </>
          ) : (
            <>
              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">¿Qué son las cookies?</h2>
                <p>Las cookies son pequeños archivos de texto que los sitios web colocan en tu dispositivo. Se usan ampliamente para hacer que los sitios funcionen eficientemente.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Cookies que usamos</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Cookies esenciales</h3>
                    <p className="text-sm">Necesarias para el funcionamiento del sitio. No se pueden desactivar.</p>
                    <ul className="list-disc ml-6 text-sm mt-2 space-y-1">
                      <li><code className="text-primary-600 dark:text-primary-400">cf-lang</code> — guarda tu preferencia de idioma</li>
                      <li><code className="text-primary-600 dark:text-primary-400">cf-theme</code> — guarda tu modo claro/oscuro</li>
                      <li><code className="text-primary-600 dark:text-primary-400">cf-cookie-consent</code> — recuerda tus preferencias de cookies</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Cookies analíticas (opcionales)</h3>
                    <p className="text-sm">Solo se establecen si das tu consentimiento. Usamos Google Analytics para entender patrones de uso anónimos.</p>
                  </div>

                  <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Cookies publicitarias (opcionales)</h3>
                    <p className="text-sm">Solo se establecen si das tu consentimiento. Google AdSense puede establecer cookies para mostrar anuncios relevantes.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Cómo gestionar las cookies</h2>
                <p>Puedes gestionar tus preferencias de cookies usando el banner de cookies en tu primera visita, borrando las cookies del navegador, o ajustando la configuración de privacidad de tu navegador.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Contacto</h2>
                <p>¿Preguntas? Escríbenos a <a href="mailto:support@flowtopdf.com" className="text-primary-600 dark:text-primary-400 underline">support@flowtopdf.com</a></p>
              </section>
            </>
          )}
        </div>
      </main>
    </>
  );
}
