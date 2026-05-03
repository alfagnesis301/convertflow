import { useTranslation } from '../../lib/i18n';
import { generateMetaTags } from '../../lib/seo';
import SEOHead from '../../components/SEOHead';
import Breadcrumbs from '../../components/Breadcrumbs';

export default function DMCAPage() {
  const { lang } = useTranslation();
  const baseMeta = generateMetaTags('home', lang);
  const isEn = lang === 'en';
  const meta = {
    ...baseMeta,
    title: 'DMCA Policy | ConvertFlow',
    description: 'ConvertFlow DMCA takedown policy and contact information for copyright concerns.',
  };

  return (
    <>
      <SEOHead meta={meta} />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />

        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">DMCA</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-10">
          {isEn ? 'Digital Millennium Copyright Act Policy' : 'Política de la Ley de Derechos de Autor del Milenio Digital'}
        </p>

        <div className="space-y-8 text-gray-600 dark:text-gray-400">
          {isEn ? (
            <>
              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Our Policy</h2>
                <p>ConvertFlow respects intellectual property rights and expects its users to do the same. ConvertFlow does not store user-uploaded files beyond the conversion session (files are deleted within 30 minutes). However, if you believe that copyrighted material has been processed or shared through our platform without authorization, you may submit a takedown request.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">How We Operate</h2>
                <p>ConvertFlow is a file conversion service. Users upload their own files, convert them, and download the result. We do not host, distribute, or share user files publicly. Files are automatically deleted within 30 minutes of upload. We do not maintain a content library.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Filing a Takedown Request</h2>
                <p>If you have a legitimate copyright concern, please send a written notice to:</p>
                <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 text-sm">
                  <p><strong>Email:</strong> <a href="mailto:support@flowtopdf.com" className="text-primary-600 dark:text-primary-400 underline">support@flowtopdf.com</a></p>
                </div>
                <p className="mt-4">Your notice should include:</p>
                <ul className="list-disc ml-6 space-y-1 mt-2">
                  <li>Your contact information (name, email, address)</li>
                  <li>A description of the copyrighted work you claim has been infringed</li>
                  <li>A description of where you believe the infringing material was located on our service</li>
                  <li>A statement that you have a good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law</li>
                  <li>A statement, made under penalty of perjury, that the information in your notice is accurate and that you are the copyright owner or authorized to act on their behalf</li>
                  <li>Your electronic or physical signature</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Response Time</h2>
                <p>We will review all properly submitted DMCA requests and respond as promptly as reasonably possible, typically within 5 business days.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Abuse of Process</h2>
                <p>Filing false or fraudulent DMCA notices may expose you to legal liability. Please ensure your claim is legitimate before submitting a notice.</p>
              </section>
            </>
          ) : (
            <>
              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Nuestra política</h2>
                <p>ConvertFlow respeta los derechos de propiedad intelectual y espera que sus usuarios hagan lo mismo. ConvertFlow no almacena los archivos subidos por los usuarios más allá de la sesión de conversión (los archivos se eliminan en 30 minutos). Si crees que material protegido por derechos de autor ha sido procesado sin autorización, puedes enviar una solicitud de eliminación.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Presentar una solicitud de eliminación</h2>
                <p>Si tienes una preocupación legítima sobre derechos de autor, envía un aviso escrito a:</p>
                <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 text-sm">
                  <p><strong>Email:</strong> <a href="mailto:support@flowtopdf.com" className="text-primary-600 dark:text-primary-400 underline">support@flowtopdf.com</a></p>
                </div>
                <p className="mt-4">Tu aviso debe incluir: tu información de contacto, descripción de la obra protegida, descripción de dónde crees que se encuentra el material infractor, una declaración de buena fe y tu firma electrónica o física.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Tiempo de respuesta</h2>
                <p>Revisaremos todas las solicitudes DMCA correctamente presentadas y responderemos lo antes posible, normalmente en 5 días hábiles.</p>
              </section>
            </>
          )}
        </div>
      </main>
    </>
  );
}
