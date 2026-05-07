import { useState, useCallback, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle, Settings, Info } from 'lucide-react';
import { useTranslation, tRaw } from '../lib/i18n';
import { getToolBySlug, getToolById } from '../lib/toolsConfig';
import type { Tool, ToolOption } from '../lib/toolsConfig';
import type { Lang } from '../lib/i18n';
import { generateMetaTags } from '../lib/seo';
import { getToolSeoContent } from '../lib/toolSeoContent';
import SEOHead from '../components/SEOHead';
import Breadcrumbs from '../components/Breadcrumbs';
import UploadBox from '../components/UploadBox';
import ConversionProgress, { type ConversionState } from '../components/ConversionProgress';
import DownloadResult from '../components/DownloadResult';
import FAQSection from '../components/FAQSection';
import RelatedTools from '../components/RelatedTools';
import FileSafetyNotice from '../components/FileSafetyNotice';

interface ToolPageProps {
  toolSlug?: string;
  lang?: Lang;
}

function OptionField({ option, value, onChange }: {
  option: ToolOption;
  value: string;
  onChange: (id: string, val: string) => void;
}) {
  if (option.type === 'select' && option.options) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {option.label}
        </label>
        <select
          value={value}
          onChange={(e) => onChange(option.id, e.target.value)}
          className="input-base dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        >
          {option.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (option.type === 'text') {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {option.label}
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(option.id, e.target.value)}
          placeholder={String(option.default)}
          className="input-base dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        />
      </div>
    );
  }

  if (option.type === 'number') {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {option.label}
        </label>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(option.id, e.target.value)}
          className="input-base dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        />
      </div>
    );
  }

  return null;
}

export default function ToolPage({ toolSlug: propSlug, lang: propLang }: ToolPageProps) {
  const { lang: ctxLang, t } = useTranslation();
  const lang = propLang ?? ctxLang;

  const tool: Tool | undefined = useMemo(() => {
    if (propSlug) return getToolBySlug(propSlug, 'en') ?? getToolById(propSlug);
    return undefined;
  }, [propSlug]);

  const [files, setFiles] = useState<File[]>([]);
  const [options, setOptions] = useState<Record<string, string>>(() => {
    if (!tool?.options) return {};
    return Object.fromEntries(tool.options.map((o) => [o.id, String(o.default)]));
  });
  const [conversionState, setConversionState] = useState<ConversionState>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [downloadName, setDownloadName] = useState<string>('');
  const [downloadSize, setDownloadSize] = useState<number | undefined>(undefined);

  const setOption = useCallback((id: string, val: string) => {
    setOptions((prev) => ({ ...prev, [id]: val }));
  }, []);

  const reset = () => {
    setFiles([]);
    setConversionState('idle');
    setErrorMessage('');
    setDownloadUrl('');
    setDownloadName('');
    setDownloadSize(undefined);
    if (tool?.options) {
      setOptions(Object.fromEntries(tool.options.map((o) => [o.id, String(o.default)])));
    }
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      setErrorMessage(t('errors.noFileSelected'));
      setConversionState('error');
      return;
    }

    setConversionState('uploading');
    setErrorMessage('');

    try {
      const formData = new FormData();
      files.forEach((f) => formData.append('files', f));
      formData.append('sourceFormat', tool!.sourceFormats[0]);
      formData.append('targetFormat', tool!.targetFormat);
      Object.entries(options).forEach(([k, v]) => {
        if (v) formData.append(k, v);
      });

      setConversionState('processing');

      const response = await fetch('/api/convert', { method: 'POST', body: formData });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as { error?: string };
        if (response.status === 501) {
          throw new Error(
            lang === 'en'
              ? 'This conversion is not available on our free server. Try a desktop app like LibreOffice (free) for this file type.'
              : 'Esta conversión no está disponible en nuestro servidor gratuito. Prueba una aplicación de escritorio como LibreOffice (gratuita) para este tipo de archivo.'
          );
        }
        throw new Error(errorData.error ?? t('errors.conversionFailed'));
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const disposition = response.headers.get('Content-Disposition') ?? '';
      const match = disposition.match(/filename[^;=\n]*=(['"]?)([^'";\n]*)\1/);
      const name = match?.[2] ?? `converted.${tool!.targetFormat}`;

      setDownloadUrl(url);
      setDownloadName(name);
      setDownloadSize(blob.size);
      setConversionState('done');
    } catch (err) {
      const msg = err instanceof Error ? err.message : t('errors.serverError');
      setErrorMessage(msg);
      setConversionState('error');
    }
  };

  if (!tool) {
    return <Navigate to={`/${lang}/`} replace />;
  }

  const meta = generateMetaTags(tool.id, lang);
  const toolName = t(`tools.${tool.id}.name`);
  const toolDesc = t(`tools.${tool.id}.desc`);

  // Pull rich SEO content (intro, useCases, FAQs, limitations) when available
  const seoContent = getToolSeoContent(tool.id, lang);

  // Long description: prefer the rich SEO intro, otherwise the locale longDesc
  const localeLongDesc = t(`tools.${tool.id}.longDesc`);
  const toolLongDesc = seoContent?.intro
    ?? (localeLongDesc !== `tools.${tool.id}.longDesc` ? localeLongDesc : '');

  // Limitations: prefer the rich SEO content, otherwise the locale value
  const localeLimitations = t(`tools.${tool.id}.limitations`);
  const toolLimitations = seoContent?.limitations
    ?? (localeLimitations !== `tools.${tool.id}.limitations` ? localeLimitations : '');

  // Use cases: prefer the rich SEO data with title + description,
  // otherwise fall back to plain string list from locales
  const richUseCases = seoContent?.useCases;
  const fallbackUseCases = tRaw<string[]>(`tools.${tool.id}.useCases`, lang);

  // FAQ: prefer rich SEO data, otherwise locales, otherwise generic
  const seoFaqs = seoContent?.faqs;
  const toolFaqsRaw = !seoFaqs ? tRaw<{ q: string; a: string }[]>(`tools.${tool.id}.faqs`, lang) : undefined;
  const genericFaqs = lang === 'en'
    ? [
        { question: `Is ${toolName} free?`, answer: `Yes, ${toolName} is completely free to use. No registration or payment required.` },
        { question: `What is the maximum file size?`, answer: `You can upload files up to 50 MB. For larger files, try splitting them first.` },
        { question: `How long does conversion take?`, answer: `Most conversions complete within a few seconds. Complex documents may take up to a minute.` },
        { question: `Are my files safe?`, answer: `Yes. Files are encrypted in transit and automatically deleted from our servers after conversion or within 30 minutes.` },
      ]
    : [
        { question: `¿Es ${toolName} gratuito?`, answer: `Sí, ${toolName} es completamente gratuito. No se requiere registro ni pago.` },
        { question: `¿Cuál es el tamaño máximo de archivo?`, answer: `Puedes subir archivos de hasta 50 MB. Para archivos más grandes, intenta dividirlos primero.` },
        { question: `¿Cuánto tarda la conversión?`, answer: `La mayoría de las conversiones se completan en pocos segundos. Los documentos complejos pueden tardar hasta un minuto.` },
        { question: `¿Están seguros mis archivos?`, answer: `Sí. Los archivos están cifrados en tránsito y se eliminan automáticamente de nuestros servidores después de la conversión o en 30 minutos.` },
      ];
  const faqs = seoFaqs
    ? seoFaqs
    : toolFaqsRaw
      ? toolFaqsRaw.map((f) => ({ question: f.q, answer: f.a }))
      : genericFaqs;

  // HowTo JSON-LD structured data
  const howToJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: lang === 'en' ? `How to use ${toolName}` : `Cómo usar ${toolName}`,
    description: toolDesc,
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: lang === 'en' ? 'Upload your file' : 'Sube tu archivo',
        text: lang === 'en'
          ? `Select your file by clicking the upload area or dragging it into the ${toolName} tool.`
          : `Selecciona tu archivo haciendo clic en el área de subida o arrastrándolo a la herramienta ${toolName}.`,
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: lang === 'en' ? 'Adjust options' : 'Ajusta las opciones',
        text: lang === 'en'
          ? 'Set any available options to customize your output, then click Convert Now.'
          : 'Configura las opciones disponibles para personalizar tu resultado y haz clic en Convertir ahora.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: lang === 'en' ? 'Download' : 'Descarga',
        text: lang === 'en'
          ? 'Click the Download button to save your converted file. Files are deleted automatically after 30 minutes.'
          : 'Haz clic en el botón Descargar para guardar tu archivo convertido. Los archivos se eliminan automáticamente en 30 minutos.',
      },
    ],
  });

  return (
    <>
      <SEOHead meta={meta} />
      {/* HowTo JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: howToJsonLd }}
      />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">{toolName}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">{toolDesc}</p>
          {/* Long description for SEO-rich tools */}
          {toolLongDesc && (
            <p className="mt-3 text-base text-gray-500 dark:text-gray-400 leading-relaxed">
              {toolLongDesc}
            </p>
          )}
        </div>

        {/* Not available */}
        {!tool.available ? (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 flex items-start gap-4">
            <AlertTriangle size={24} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800 dark:text-amber-400 mb-1">
                {t('common.comingSoon')}
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-500">
                {lang === 'en'
                  ? 'This tool is not yet available. We are working on it and it will be ready soon.'
                  : 'Esta herramienta aún no está disponible. Estamos trabajando en ella y estará lista pronto.'}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Limitation notice for complex conversions */}
            {(tool.id === 'pdf-to-word' || tool.id === 'pdf-to-docx') && (
              <div className="mb-6 flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl text-sm text-blue-700 dark:text-blue-400">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <span>
                  {lang === 'en'
                    ? 'PDF to Word conversion quality depends on your PDF. Scanned PDFs may require OCR for best results.'
                    : 'La calidad de la conversión PDF a Word depende de tu PDF. Los PDFs escaneados pueden requerir OCR para mejores resultados.'}
                </span>
              </div>
            )}

            {/* Main conversion card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 mb-6">
              {conversionState === 'done' ? (
                <DownloadResult
                  downloadUrl={downloadUrl}
                  fileName={downloadName}
                  fileSizeBytes={downloadSize}
                  onConvertAnother={reset}
                />
              ) : (
                <>
                  <UploadBox
                    acceptedFormats={tool.sourceFormats}
                    multiple={tool.acceptMultiple}
                    maxSizeMB={50}
                    onFilesSelected={setFiles}
                    disabled={conversionState === 'uploading' || conversionState === 'processing'}
                  />

                  {/* Options */}
                  {tool.options && tool.options.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-2 mb-4">
                        <Settings size={16} className="text-gray-400" />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {lang === 'en' ? 'Options' : 'Opciones'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {tool.options.map((opt) => (
                          <OptionField
                            key={opt.id}
                            option={opt}
                            value={options[opt.id] ?? String(opt.default)}
                            onChange={setOption}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Progress */}
                  <ConversionProgress
                    state={conversionState}
                    errorMessage={errorMessage}
                    fileName={files[0]?.name}
                  />

                  {/* Convert button */}
                  {(conversionState === 'idle' || conversionState === 'error') && (
                    <div className="mt-6 flex flex-col items-center gap-4">
                      <button
                        onClick={handleConvert}
                        disabled={files.length === 0}
                        className="btn-primary text-base px-10 py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircle size={20} />
                        {t('common.convertNow')}
                      </button>
                      {conversionState === 'error' && (
                        <button
                          onClick={reset}
                          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline"
                        >
                          {lang === 'en' ? 'Try again with a different file' : 'Intentar con otro archivo'}
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* File safety notice */}
            <FileSafetyNotice />
          </>
        )}

        {/* How to use */}
        <section className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            {lang === 'en' ? `How to use ${toolName}` : `Cómo usar ${toolName}`}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                step: '1',
                title: lang === 'en' ? 'Upload your file' : 'Sube tu archivo',
                desc: lang === 'en' ? `Select your file by clicking the upload area or dragging it in.` : `Selecciona tu archivo haciendo clic en el área de subida o arrastrándolo.`,
              },
              {
                step: '2',
                title: lang === 'en' ? 'Adjust options' : 'Ajusta las opciones',
                desc: lang === 'en' ? 'Set any available options to customize your output.' : 'Configura las opciones disponibles para personalizar tu resultado.',
              },
              {
                step: '3',
                title: lang === 'en' ? 'Download' : 'Descarga',
                desc: lang === 'en' ? 'Click Convert and download your file instantly.' : 'Haz clic en Convertir y descarga tu archivo al instante.',
              },
            ].map((step) => (
              <div key={step.step} className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 text-white text-sm font-bold flex items-center justify-center">
                  {step.step}
                </span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">{step.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Use Cases — rich format with title + description */}
        {richUseCases && richUseCases.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {lang === 'en' ? 'Common Use Cases' : 'Casos de uso habituales'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {richUseCases.map((useCase, i) => (
                <div key={i} className="flex gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                  <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">{useCase.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{useCase.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Use Cases — fallback simple-string format */}
        {!richUseCases && fallbackUseCases && fallbackUseCases.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {lang === 'en' ? 'Common Use Cases' : 'Casos de uso habituales'}
            </h2>
            <ul className="space-y-2">
              {fallbackUseCases.map((useCase, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  {useCase}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* FAQ */}
        <FAQSection faqs={faqs} title={lang === 'en' ? 'Frequently Asked Questions' : 'Preguntas frecuentes'} />

        {/* Limitations info box */}
        {toolLimitations && (
          <div className="mt-4 flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-600 dark:text-gray-400">
            <Info size={16} className="shrink-0 mt-0.5 text-gray-400" />
            <span>
              <strong className="font-semibold text-gray-700 dark:text-gray-300">
                {lang === 'en' ? 'Limitations: ' : 'Limitaciones: '}
              </strong>
              {toolLimitations}
            </span>
          </div>
        )}

        {/* Related tools */}
        <RelatedTools currentToolId={tool.id} category={tool.category} />
      </main>
    </>
  );
}
