import { useTranslation } from '../../lib/i18n';
import { generateMetaTags } from '../../lib/seo';
import SEOHead from '../../components/SEOHead';
import Breadcrumbs from '../../components/Breadcrumbs';

export default function PrivacyPolicyPage() {
  const { lang } = useTranslation();
  const meta = generateMetaTags('privacy', lang);
  const isEn = lang === 'en';

  const updated = 'May 2025';

  return (
    <>
      <SEOHead meta={meta} />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />

        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {isEn ? 'Privacy Policy' : 'Política de Privacidad'}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-10">
          {isEn ? `Last updated: ${updated}` : `Última actualización: ${updated}`}
        </p>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-8 text-gray-600 dark:text-gray-400">
          {isEn ? (
            <>
              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Introduction</h2>
                <p>ConvertFlow ("we", "our", "us") provides free online document conversion tools at convertflow.app. We take your privacy seriously. This policy explains what information we collect, how we use it, and your rights.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">What We Collect</h2>
                <p>We collect minimal information necessary to provide the service:</p>
                <ul className="list-disc ml-6 space-y-1 mt-2">
                  <li><strong>Files you upload:</strong> Temporarily stored on our servers for processing only. Never read by humans. Automatically deleted within 30 minutes.</li>
                  <li><strong>Browser information:</strong> We may log your IP address, browser type, and pages visited for security and abuse prevention.</li>
                  <li><strong>Cookie preferences:</strong> Stored locally in your browser (localStorage). We do not transmit these to a database.</li>
                </ul>
                <p className="mt-3">We do not collect your name, email, or any personal data unless you contact us via the contact form.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">File Processing</h2>
                <p>Your uploaded files are processed exclusively to perform the conversion you requested. Files are:</p>
                <ul className="list-disc ml-6 space-y-1 mt-2">
                  <li>Stored in a temporary directory on our server</li>
                  <li>Never read or analyzed by our team</li>
                  <li>Automatically deleted within 30 minutes of upload</li>
                  <li>Transferred over encrypted HTTPS connections</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Cookies</h2>
                <p>We use three types of cookies:</p>
                <ul className="list-disc ml-6 space-y-2 mt-2">
                  <li><strong>Essential cookies:</strong> Required for the site to function (language preference, theme). Cannot be disabled.</li>
                  <li><strong>Analytics cookies:</strong> If you consent, we use Google Analytics to understand aggregate site usage. No personal data is stored.</li>
                  <li><strong>Advertising cookies:</strong> If you consent, Google AdSense may serve relevant ads to support our free service. You can opt out at any time.</li>
                </ul>
                <p className="mt-3">You can change your cookie preferences at any time by clicking "Manage Preferences" in the cookie banner.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Google AdSense (Future)</h2>
                <p>We plan to integrate Google AdSense to support the free service. AdSense may use cookies and device identifiers to show relevant ads. You can opt out via Google's ad settings at <a href="https://adssettings.google.com" className="text-primary-600 underline" target="_blank" rel="noopener noreferrer">adssettings.google.com</a>.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Google Analytics (Future)</h2>
                <p>We may use Google Analytics to analyze anonymous traffic patterns. We enable IP anonymization and do not share this data with third parties. You can opt out using the <a href="https://tools.google.com/dlpage/gaoptout" className="text-primary-600 underline" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a>.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Your Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc ml-6 space-y-1 mt-2">
                  <li>Know what data we hold about you</li>
                  <li>Request deletion of your data</li>
                  <li>Opt out of non-essential cookies</li>
                  <li>Contact us with any privacy concerns</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Data Retention</h2>
                <p>Uploaded files are deleted within 30 minutes. Server logs are retained for up to 30 days for security purposes, then automatically purged. We do not maintain long-term databases of user activity.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Security</h2>
                <p>We use HTTPS for all data transfer. Server access is restricted. File storage uses temporary directories with automated cleanup. We do not guarantee security against all threats, but we take reasonable precautions.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Contact</h2>
                <p>Questions about this policy? Email us at <a href="mailto:support@flowtopdf.com" className="text-primary-600 dark:text-primary-400 underline">support@flowtopdf.com</a>.</p>
              </section>
            </>
          ) : (
            <>
              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Introducción</h2>
                <p>ConvertFlow ("nosotros", "nuestro") ofrece herramientas de conversión de documentos gratuitas en convertflow.app. Nos tomamos tu privacidad en serio. Esta política explica qué información recopilamos, cómo la usamos y tus derechos.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Qué recopilamos</h2>
                <p>Recopilamos información mínima necesaria para prestar el servicio:</p>
                <ul className="list-disc ml-6 space-y-1 mt-2">
                  <li><strong>Archivos que subes:</strong> Almacenados temporalmente en nuestros servidores solo para procesamiento. Nunca leídos por personas. Eliminados automáticamente en 30 minutos.</li>
                  <li><strong>Información del navegador:</strong> Podemos registrar tu dirección IP, tipo de navegador y páginas visitadas para seguridad y prevención de abusos.</li>
                  <li><strong>Preferencias de cookies:</strong> Almacenadas localmente en tu navegador (localStorage). No las transmitimos a una base de datos.</li>
                </ul>
                <p className="mt-3">No recopilamos tu nombre, email ni ningún dato personal a menos que te pongas en contacto con nosotros a través del formulario de contacto.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Procesamiento de archivos</h2>
                <p>Tus archivos subidos se procesan exclusivamente para realizar la conversión que solicitaste. Los archivos son:</p>
                <ul className="list-disc ml-6 space-y-1 mt-2">
                  <li>Almacenados en un directorio temporal en nuestro servidor</li>
                  <li>Nunca leídos ni analizados por nuestro equipo</li>
                  <li>Eliminados automáticamente en 30 minutos tras la subida</li>
                  <li>Transferidos mediante conexiones HTTPS cifradas</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Cookies</h2>
                <p>Usamos tres tipos de cookies:</p>
                <ul className="list-disc ml-6 space-y-2 mt-2">
                  <li><strong>Cookies esenciales:</strong> Necesarias para el funcionamiento del sitio (preferencia de idioma, tema). No se pueden desactivar.</li>
                  <li><strong>Cookies analíticas:</strong> Si das tu consentimiento, usamos Google Analytics para entender el uso agregado del sitio. No se almacenan datos personales.</li>
                  <li><strong>Cookies publicitarias:</strong> Si das tu consentimiento, Google AdSense puede mostrar anuncios relevantes para financiar el servicio gratuito. Puedes optar por no recibirlos en cualquier momento.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Tus derechos</h2>
                <p>Tienes derecho a saber qué datos tenemos sobre ti, solicitar su eliminación, optar por no recibir cookies no esenciales y contactarnos con cualquier inquietud de privacidad.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Retención de datos</h2>
                <p>Los archivos subidos se eliminan en 30 minutos. Los registros del servidor se conservan hasta 30 días por motivos de seguridad, luego se purgan automáticamente.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Contacto</h2>
                <p>¿Preguntas sobre esta política? Escríbenos a <a href="mailto:support@flowtopdf.com" className="text-primary-600 dark:text-primary-400 underline">support@flowtopdf.com</a>.</p>
              </section>
            </>
          )}
        </div>
      </main>
    </>
  );
}
