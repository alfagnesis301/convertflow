import { Shield, Zap, Users } from 'lucide-react';
import { useTranslation } from '../lib/i18n';
import { generateMetaTags } from '../lib/seo';
import SEOHead from '../components/SEOHead';
import Breadcrumbs from '../components/Breadcrumbs';

export default function AboutPage() {
  const { lang } = useTranslation();
  const meta = generateMetaTags('about', lang);

  const isEn = lang === 'en';

  return (
    <>
      <SEOHead meta={meta} />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />

        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {isEn ? 'About ConvertFlow' : 'Sobre ConvertFlow'}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
          {isEn
            ? 'ConvertFlow is a free, browser-based toolkit for working with PDF files. We built it because most PDF tools are either too expensive, require account creation, or fill your browser with ads. We wanted something simpler.'
            : 'ConvertFlow es un kit de herramientas gratuito basado en el navegador para trabajar con archivos PDF. Lo creamos porque la mayoría de herramientas PDF son demasiado caras, requieren crear una cuenta o llenan el navegador de anuncios. Queríamos algo más sencillo.'}
        </p>

        <div className="space-y-10">
          {/* Mission */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              {isEn ? 'Our Mission' : 'Nuestra misión'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {isEn
                ? 'Make professional-grade document tools freely available to everyone — no subscriptions, no account required, no watermarks. We believe document tools should be utilities, not services you pay a monthly fee for.'
                : 'Hacer que las herramientas de documentos de nivel profesional estén disponibles gratuitamente para todos — sin suscripciones, sin cuenta necesaria, sin marcas de agua. Creemos que las herramientas de documentos deben ser utilidades, no servicios con tarifa mensual.'}
            </p>
          </section>

          {/* Values */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-5">
              {isEn ? 'Our Values' : 'Nuestros valores'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                {
                  icon: Shield,
                  title: isEn ? 'Privacy' : 'Privacidad',
                  desc: isEn
                    ? 'Your files are not stored, sold, or analyzed. Processing is ephemeral — files are deleted automatically after conversion.'
                    : 'Tus archivos no se almacenan, venden ni analizan. El procesamiento es efímero: los archivos se eliminan automáticamente tras la conversión.',
                  color: 'text-blue-500',
                  bg: 'bg-blue-50 dark:bg-blue-950/40',
                },
                {
                  icon: Zap,
                  title: isEn ? 'Speed' : 'Velocidad',
                  desc: isEn
                    ? 'Conversions happen in seconds, not minutes. We optimize processing so you spend time on your work, not waiting.'
                    : 'Las conversiones ocurren en segundos, no minutos. Optimizamos el procesamiento para que pases tiempo en tu trabajo, no esperando.',
                  color: 'text-amber-500',
                  bg: 'bg-amber-50 dark:bg-amber-950/40',
                },
                {
                  icon: Users,
                  title: isEn ? 'Simplicity' : 'Simplicidad',
                  desc: isEn
                    ? 'Every tool has a single purpose. Upload, convert, download. No unnecessary steps, no dark patterns.'
                    : 'Cada herramienta tiene un único propósito. Sube, convierte, descarga. Sin pasos innecesarios ni patrones oscuros.',
                  color: 'text-violet-500',
                  bg: 'bg-violet-50 dark:bg-violet-950/40',
                },
              ].map((v) => {
                const Icon = v.icon;
                return (
                  <div key={v.title} className="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-4 ${v.bg}`}>
                      <Icon size={20} className={v.color} />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{v.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{v.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Technology */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              {isEn ? 'Technology' : 'Tecnología'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              {isEn
                ? 'ConvertFlow is built on a modern open-source stack:'
                : 'ConvertFlow está construido sobre un moderno stack de código abierto:'}
            </p>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              {[
                isEn ? 'LibreOffice — handles Word, Excel, PowerPoint, ODT, and RTF conversions' : 'LibreOffice — gestiona conversiones de Word, Excel, PowerPoint, ODT y RTF',
                isEn ? 'Poppler — renders PDF pages as images (PDF to JPG/PNG)' : 'Poppler — renderiza páginas PDF como imágenes (PDF a JPG/PNG)',
                isEn ? 'Tesseract OCR — optical character recognition for scanned documents' : 'Tesseract OCR — reconocimiento óptico de caracteres para documentos escaneados',
                isEn ? 'pdf-lib — pure JavaScript PDF manipulation (merge, split, rotate, protect)' : 'pdf-lib — manipulación PDF en JavaScript (unir, dividir, rotar, proteger)',
                isEn ? 'Sharp — high-performance image processing' : 'Sharp — procesamiento de imágenes de alto rendimiento',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary-500 font-bold mt-0.5">·</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
              {isEn
                ? 'The frontend is built with React, TypeScript, Tailwind CSS, and Vite. All server processing is done in Node.js/Express.'
                : 'El frontend está construido con React, TypeScript, Tailwind CSS y Vite. Todo el procesamiento del servidor se realiza en Node.js/Express.'}
            </p>
          </section>

          {/* No false claims */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              {isEn ? 'What We Do Not Claim' : 'Lo que no afirmamos'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {isEn
                ? 'We do not promise perfect conversion quality for all documents. Complex PDF layouts, scanned documents, and heavily formatted files may require manual cleanup after conversion. We are honest about this. Our tools are useful for the vast majority of everyday document needs.'
                : 'No prometemos una calidad de conversión perfecta para todos los documentos. Los diseños complejos de PDF, los documentos escaneados y los archivos con formato intensivo pueden requerir correcciones manuales. Somos honestos al respecto. Nuestras herramientas son útiles para la gran mayoría de necesidades cotidianas de documentos.'}
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
