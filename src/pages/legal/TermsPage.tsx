import { useTranslation } from '../../lib/i18n';
import { generateMetaTags } from '../../lib/seo';
import SEOHead from '../../components/SEOHead';
import Breadcrumbs from '../../components/Breadcrumbs';

export default function TermsPage() {
  const { lang } = useTranslation();
  const meta = generateMetaTags('terms', lang);
  const isEn = lang === 'en';
  const updated = 'May 2025';

  return (
    <>
      <SEOHead meta={meta} />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />

        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {isEn ? 'Terms of Service' : 'Términos de servicio'}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-10">
          {isEn ? `Last updated: ${updated}` : `Última actualización: ${updated}`}
        </p>

        <div className="space-y-8 text-gray-600 dark:text-gray-400">
          {isEn ? (
            <>
              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Acceptance of Terms</h2>
                <p>By using FlowToPDF, you agree to these Terms of Service. If you do not agree, please do not use the service.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Accepted Use</h2>
                <p>FlowToPDF may be used to:</p>
                <ul className="list-disc ml-6 space-y-1 mt-2">
                  <li>Convert your own documents and files</li>
                  <li>Convert documents you have permission to modify</li>
                  <li>Convert publicly available documents for personal use</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Prohibited Use</h2>
                <p>You may not use FlowToPDF to:</p>
                <ul className="list-disc ml-6 space-y-1 mt-2">
                  <li>Process illegal content or materials</li>
                  <li>Convert copyrighted documents without authorization from the copyright holder</li>
                  <li>Circumvent security measures or attempt unauthorized access</li>
                  <li>Abuse the service through automated bulk processing (without prior agreement)</li>
                  <li>Upload malware or malicious files</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">File Ownership</h2>
                <p>You retain full ownership of any files you upload to FlowToPDF. We do not claim any rights over your content. Files are deleted automatically and are never used for any purpose other than performing the conversion you requested.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">No Warranties on Conversion Quality</h2>
                <p>FlowToPDF provides conversion tools on an "as-is" basis. We do not guarantee that conversions will be perfect or that all formatting will be preserved. Complex documents may require manual cleanup after conversion. We are not responsible for errors in converted output.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Limitation of Liability</h2>
                <p>To the maximum extent permitted by law, FlowToPDF shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of the service, including data loss, corrupted files, or business interruption.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Service Availability</h2>
                <p>We strive to keep FlowToPDF available 24/7, but we do not guarantee uninterrupted service. Maintenance, server issues, or technical problems may cause temporary unavailability.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Changes to Terms</h2>
                <p>We may update these terms from time to time. Continued use of FlowToPDF after changes constitutes acceptance of the new terms. We will update the "Last updated" date when changes are made.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Contact</h2>
                <p>Questions? Email <a href="mailto:support@flowtopdf.com" className="text-primary-600 dark:text-primary-400 underline">support@flowtopdf.com</a></p>
              </section>
            </>
          ) : (
            <>
              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Aceptación de los términos</h2>
                <p>Al usar FlowToPDF, aceptas estos Términos de Servicio. Si no estás de acuerdo, por favor no uses el servicio.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Uso aceptado</h2>
                <p>FlowToPDF puede usarse para convertir tus propios documentos, documentos para los que tienes permiso de modificación, y documentos de acceso público para uso personal.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Uso prohibido</h2>
                <p>No puedes usar FlowToPDF para procesar contenido ilegal, convertir documentos con derechos de autor sin autorización, eludir medidas de seguridad, abusar del servicio con procesamiento masivo automatizado ni subir malware.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Propiedad de archivos</h2>
                <p>Conservas la propiedad total de los archivos que subes a FlowToPDF. No reclamamos ningún derecho sobre tu contenido. Los archivos se eliminan automáticamente y nunca se usan para ningún otro fin que no sea realizar la conversión solicitada.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Sin garantías sobre la calidad de conversión</h2>
                <p>FlowToPDF ofrece herramientas de conversión "tal cual". No garantizamos que las conversiones sean perfectas o que se conserve todo el formato. Los documentos complejos pueden requerir correcciones manuales.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Limitación de responsabilidad</h2>
                <p>En la máxima medida permitida por la ley, FlowToPDF no será responsable de daños indirectos, incidentales, especiales o consecuentes derivados del uso del servicio.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Disponibilidad del servicio</h2>
                <p>Nos esforzamos por mantener FlowToPDF disponible 24/7, pero no garantizamos un servicio ininterrumpido. El mantenimiento o problemas técnicos pueden causar indisponibilidad temporal.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Cambios en los términos</h2>
                <p>Podemos actualizar estos términos en cualquier momento. El uso continuado de FlowToPDF después de los cambios constituye la aceptación de los nuevos términos.</p>
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
