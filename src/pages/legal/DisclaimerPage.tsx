import { useTranslation } from '../../lib/i18n';
import { generateMetaTags } from '../../lib/seo';
import SEOHead from '../../components/SEOHead';
import Breadcrumbs from '../../components/Breadcrumbs';

export default function DisclaimerPage() {
  const { lang } = useTranslation();
  const baseMeta = generateMetaTags('home', lang);
  const isEn = lang === 'en';
  const meta = {
    ...baseMeta,
    title: isEn ? 'Disclaimer | ConvertFlow' : 'Aviso legal | ConvertFlow',
    description: isEn
      ? 'ConvertFlow disclaimer regarding conversion quality and service limitations.'
      : 'Aviso legal de ConvertFlow sobre la calidad de conversión y las limitaciones del servicio.',
  };

  return (
    <>
      <SEOHead meta={meta} />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />

        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {isEn ? 'Disclaimer' : 'Aviso legal'}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-10">
          {isEn ? 'Last updated: May 2025' : 'Última actualización: mayo 2025'}
        </p>

        <div className="space-y-8 text-gray-600 dark:text-gray-400">
          {isEn ? (
            <>
              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Conversion Quality</h2>
                <p>ConvertFlow provides document conversion tools that use open-source software (LibreOffice, Poppler, Tesseract, pdf-lib). While these tools are capable and widely used, document conversion is a technically complex process, and results may not be perfect in all cases.</p>
                <p className="mt-3">In particular:</p>
                <ul className="list-disc ml-6 space-y-1 mt-2">
                  <li>Complex PDF layouts may not convert perfectly to Word or other formats</li>
                  <li>Fonts may be substituted if they are not available on our servers</li>
                  <li>Scanned PDFs converted without OCR will not be text-searchable</li>
                  <li>Tables, charts, and embedded graphics may lose formatting</li>
                  <li>OCR accuracy depends on scan quality and document language</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">No Guarantee of Accuracy</h2>
                <p>We do not guarantee that converted documents will be accurate, complete, or free from errors. For legally sensitive documents (contracts, legal filings, medical records), we recommend verifying converted output carefully and using professional software or services when accuracy is critical.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Service Availability</h2>
                <p>ConvertFlow is provided free of charge on a best-effort basis. We do not guarantee continuous availability. The service may be interrupted for maintenance, updates, or due to technical issues beyond our control.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Third-Party Libraries</h2>
                <p>ConvertFlow relies on open-source libraries maintained by their respective communities. We are not responsible for bugs, security vulnerabilities, or behavior changes in those libraries.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">External Links</h2>
                <p>Our site may contain links to external websites. We are not responsible for the content, privacy practices, or availability of those sites.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Contact</h2>
                <p>Questions about this disclaimer? Contact us at <a href="mailto:support@convertflow.app" className="text-primary-600 dark:text-primary-400 underline">support@convertflow.app</a></p>
              </section>
            </>
          ) : (
            <>
              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Calidad de conversión</h2>
                <p>ConvertFlow ofrece herramientas de conversión que utilizan software de código abierto. Si bien estas herramientas son capaces y ampliamente utilizadas, la conversión de documentos es un proceso técnicamente complejo y los resultados pueden no ser perfectos en todos los casos.</p>
                <p className="mt-3">En particular, los diseños complejos de PDF pueden no convertirse perfectamente, las fuentes pueden sustituirse, las tablas y gráficos pueden perder formato, y la precisión del OCR depende de la calidad del escaneo.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Sin garantía de precisión</h2>
                <p>No garantizamos que los documentos convertidos sean precisos, completos o libres de errores. Para documentos legalmente sensibles, recomendamos verificar cuidadosamente el resultado convertido.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Disponibilidad del servicio</h2>
                <p>ConvertFlow se proporciona gratuitamente con el mejor esfuerzo posible. No garantizamos disponibilidad continua. El servicio puede interrumpirse por mantenimiento o problemas técnicos.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Contacto</h2>
                <p>¿Preguntas sobre este aviso legal? Contáctanos en <a href="mailto:support@convertflow.app" className="text-primary-600 dark:text-primary-400 underline">support@convertflow.app</a></p>
              </section>
            </>
          )}
        </div>
      </main>
    </>
  );
}
