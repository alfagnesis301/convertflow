/**
 * Category-page long-form SEO content.
 *
 * Category (hub) pages previously rendered only an H1 + one-line description +
 * a tool grid (~200 words, no FAQ). That thin content is why they ranked on
 * page 1 but captured no impressions. This data adds an editorial intro,
 * "why use" points and FAQs so the hubs have real content and FAQ schema.
 *
 * Consumed by:
 *   1. CategoryPage.tsx (runtime, hydrated UI)
 *   2. scripts/prerender.mts (build-time static HTML + FAQPage JSON-LD in <head>)
 *
 * Both consumers render the same content so users and Google see identical pages.
 * Facts must match the real service: 50 MB upload limit, files deleted within
 * 30 minutes, no signup, no watermark, browser-based, English + Spanish.
 */

export interface CategorySeoSection {
  /** Long descriptive paragraph about what this group of tools does */
  intro: string;
  /** 3-4 reasons to use these tools (title + short description) */
  whyUse: { title: string; description: string }[];
  /** 5-6 FAQ pairs matching what users actually search */
  faqs: { question: string; answer: string }[];
}

export interface CategorySeoContent {
  en: CategorySeoSection;
  es: CategorySeoSection;
}

export const categorySeoContent: Record<string, CategorySeoContent> = {
  // ─── PDF Converter ─────────────────────────────────────────────────────────
  'pdf-converter': {
    en: {
      intro:
        'FlowToPDF\'s converter tools let you change a PDF into another format — Word, JPG, PNG, plain text or HTML — or turn documents and images back into PDF. Everything runs free in your browser: no signup, no watermark, and every file is deleted automatically within 30 minutes. Pick the conversion you need below, upload a file up to 50 MB, and download the result in seconds. The most requested conversions are PDF to Word (for editing) and Word to PDF (for sharing a fixed layout), but you can also extract PDF pages as images, pull raw text, or publish a PDF as HTML.',
      whyUse: [
        { title: 'Edit content locked in a PDF', description: 'Convert PDF to Word to change wording in contracts, résumés or reports without retyping.' },
        { title: 'Share a fixed, universal layout', description: 'Convert Word, images or HTML to PDF so the document looks identical on every device.' },
        { title: 'Reuse pages as images', description: 'Turn PDF pages into JPG or PNG for slides, thumbnails or social posts.' },
        { title: 'No install, any device', description: 'All conversions run in the browser on desktop, tablet or phone — nothing to download.' },
      ],
      faqs: [
        { question: 'What can I convert a PDF to?', answer: 'PDF to Word (.docx), JPG, PNG, plain text and HTML. You can also convert Word, PowerPoint, images, text and HTML into PDF.' },
        { question: 'Is the PDF converter free?', answer: 'Yes — every converter is 100% free with no signup, no watermark and no daily limit.' },
        { question: 'Can I convert PDF to Word without losing formatting?', answer: 'For most documents paragraphs, headings, tables and images are preserved. Highly designed PDFs may need light cleanup after conversion.' },
        { question: 'Can I convert a scanned PDF?', answer: 'Scanned pages are images. Run our OCR PDF tool first to add a real text layer, then convert.' },
        { question: 'What is the maximum file size?', answer: 'Up to 50 MB per file. For larger PDFs, split them first with our Split PDF tool.' },
        { question: 'Are my files private?', answer: 'Yes. Files are transferred over HTTPS, processed temporarily and deleted automatically within 30 minutes.' },
      ],
    },
    es: {
      intro:
        'Las herramientas de conversión de FlowToPDF te permiten transformar un PDF en otro formato — Word, JPG, PNG, texto plano o HTML — o convertir documentos e imágenes de vuelta a PDF. Todo funciona gratis en tu navegador: sin registro, sin marca de agua, y cada archivo se elimina automáticamente en 30 minutos. Elige la conversión que necesites abajo, sube un archivo de hasta 50 MB y descarga el resultado en segundos. Las conversiones más solicitadas son PDF a Word (para editar) y Word a PDF (para compartir con un diseño fijo), pero también puedes extraer páginas de un PDF como imágenes, obtener el texto o publicar un PDF como HTML.',
      whyUse: [
        { title: 'Editar contenido bloqueado en un PDF', description: 'Convierte PDF a Word para cambiar texto en contratos, currículums o informes sin reescribir.' },
        { title: 'Compartir un diseño fijo y universal', description: 'Convierte Word, imágenes o HTML a PDF para que el documento se vea igual en cualquier dispositivo.' },
        { title: 'Reutilizar páginas como imágenes', description: 'Convierte páginas de PDF a JPG o PNG para diapositivas, miniaturas o redes sociales.' },
        { title: 'Sin instalar, en cualquier dispositivo', description: 'Todas las conversiones funcionan en el navegador en ordenador, tablet o móvil — sin descargas.' },
      ],
      faqs: [
        { question: '¿A qué puedo convertir un PDF?', answer: 'PDF a Word (.docx), JPG, PNG, texto plano y HTML. También puedes convertir Word, PowerPoint, imágenes, texto y HTML a PDF.' },
        { question: '¿El convertidor de PDF es gratis?', answer: 'Sí — cada convertidor es 100% gratuito, sin registro, sin marca de agua y sin límite diario.' },
        { question: '¿Puedo convertir PDF a Word sin perder el formato?', answer: 'En la mayoría de documentos se conservan párrafos, encabezados, tablas e imágenes. Los PDFs muy diseñados pueden necesitar pequeños retoques.' },
        { question: '¿Puedo convertir un PDF escaneado?', answer: 'Las páginas escaneadas son imágenes. Usa primero nuestra herramienta OCR PDF para añadir una capa de texto real y luego convierte.' },
        { question: '¿Cuál es el tamaño máximo de archivo?', answer: 'Hasta 50 MB por archivo. Para PDFs más grandes, divídelos primero con Dividir PDF.' },
        { question: '¿Mis archivos son privados?', answer: 'Sí. Los archivos se transfieren por HTTPS, se procesan temporalmente y se eliminan automáticamente en 30 minutos.' },
      ],
    },
  },

  // ─── Image to PDF ──────────────────────────────────────────────────────────
  'image-to-pdf': {
    en: {
      intro:
        'Turn images into PDF documents with FlowToPDF\'s image tools. Upload JPG, PNG, WebP, GIF or SVG files — one or many at once — and each image becomes a page in a single PDF. Choose the page size (A4, Letter, Legal or auto-fit to the image) and portrait or landscape orientation. It\'s ideal for bundling scanned receipts, photo IDs or a set of graphics into one file that opens the same way everywhere. Everything runs free in your browser with no signup, no watermark, and automatic deletion within 30 minutes.',
      whyUse: [
        { title: 'Bundle many images into one file', description: 'Combine a folder of photos, receipts or screenshots into a single, easy-to-share PDF.' },
        { title: 'Meet "PDF only" upload rules', description: 'Many portals and forms reject image uploads but accept PDFs — convert and submit.' },
        { title: 'Keep original quality', description: 'Images are embedded without re-encoding, so quality matches your source files.' },
        { title: 'Control page size and orientation', description: 'Pick A4, Letter, Legal or auto-fit, plus portrait or landscape.' },
      ],
      faqs: [
        { question: 'Which image formats can I convert to PDF?', answer: 'JPG, PNG, WebP, GIF and SVG. Upload one image or several — each becomes a page in the PDF.' },
        { question: 'Can I combine multiple images into one PDF?', answer: 'Yes. Upload several images and they become consecutive pages in the order shown.' },
        { question: 'Will converting reduce image quality?', answer: 'No. Images are embedded as-is without re-encoding, so quality matches the originals.' },
        { question: 'Can I choose A4 or Letter page size?', answer: 'Yes — choose Auto (fit to image), A4, Letter or Legal, plus portrait or landscape.' },
        { question: 'Is it free and private?', answer: 'Yes. Free with no signup or watermark; files are processed over HTTPS and deleted within 30 minutes.' },
      ],
    },
    es: {
      intro:
        'Convierte imágenes en documentos PDF con las herramientas de imagen de FlowToPDF. Sube archivos JPG, PNG, WebP, GIF o SVG — uno o varios a la vez — y cada imagen se convierte en una página de un único PDF. Elige el tamaño de página (A4, Carta, Legal o ajuste automático a la imagen) y orientación vertical u horizontal. Es ideal para agrupar recibos escaneados, documentos de identidad o un conjunto de gráficos en un solo archivo que se abre igual en todas partes. Todo funciona gratis en tu navegador, sin registro, sin marca de agua y con borrado automático en 30 minutos.',
      whyUse: [
        { title: 'Agrupar varias imágenes en un archivo', description: 'Combina una carpeta de fotos, recibos o capturas en un único PDF fácil de compartir.' },
        { title: 'Cumplir reglas de "solo PDF"', description: 'Muchos portales rechazan imágenes pero aceptan PDFs — convierte y envía.' },
        { title: 'Mantener la calidad original', description: 'Las imágenes se incrustan sin recodificar, así que la calidad coincide con tus archivos.' },
        { title: 'Controlar tamaño y orientación', description: 'Elige A4, Carta, Legal o ajuste automático, más vertical u horizontal.' },
      ],
      faqs: [
        { question: '¿Qué formatos de imagen puedo convertir a PDF?', answer: 'JPG, PNG, WebP, GIF y SVG. Sube una imagen o varias — cada una será una página del PDF.' },
        { question: '¿Puedo combinar varias imágenes en un PDF?', answer: 'Sí. Sube varias imágenes y se convierten en páginas consecutivas en el orden mostrado.' },
        { question: '¿Convertir reduce la calidad de la imagen?', answer: 'No. Las imágenes se incrustan tal cual sin recodificar, así que la calidad coincide con los originales.' },
        { question: '¿Puedo elegir tamaño A4 o Carta?', answer: 'Sí — elige Auto (ajustar a imagen), A4, Carta o Legal, más orientación vertical u horizontal.' },
        { question: '¿Es gratis y privado?', answer: 'Sí. Gratis, sin registro ni marca de agua; los archivos se procesan por HTTPS y se eliminan en 30 minutos.' },
      ],
    },
  },

  // ─── PDF Tools (editing) ────────────────────────────────────────────────────
  'pdf-tools': {
    en: {
      intro:
        'FlowToPDF\'s editing tools cover everything you do with an existing PDF: merge several files into one, split a PDF by page range or extract single pages, compress a large PDF to fit an email limit, rotate pages, add or remove a password, and run OCR to make scanned pages searchable. Each tool runs free in your browser with no signup, no watermark, and automatic file deletion within 30 minutes. Upload files up to 50 MB (merge combines up to 20 files) and download the result in seconds.',
      whyUse: [
        { title: 'Combine or divide documents', description: 'Merge chapters and scans into one file, or split a long PDF into smaller parts.' },
        { title: 'Make big PDFs emailable', description: 'Compress an oversized PDF so it fits a 25 MB Gmail or 20 MB Outlook attachment limit.' },
        { title: 'Fix and secure pages', description: 'Rotate sideways scans, add a password to sensitive files, or unlock ones you own.' },
        { title: 'Search scanned documents', description: 'OCR adds a real text layer so you can find names, clauses and dates in scans.' },
      ],
      faqs: [
        { question: 'How do I split a PDF into separate files?', answer: 'Open the Split PDF tool, choose "extract every page" or enter ranges like "1-3, 5, 7-9", then download the parts as individual PDFs or a ZIP.' },
        { question: 'How do I merge PDF files?', answer: 'Use Merge PDF to combine up to 20 files. Drag to set the order, then download one combined PDF.' },
        { question: 'How much can I compress a PDF?', answer: 'Image-heavy PDFs can shrink 50-80%. Text-only PDFs shrink less because text is already compact. Text stays crisp at every level.' },
        { question: 'Are these PDF tools free?', answer: 'Yes — merge, split, compress, rotate, protect, unlock and OCR are all free with no signup or watermark.' },
        { question: 'What is the maximum file size?', answer: 'Up to 50 MB per file (merge combines up to 20 files). Split a larger PDF first if needed.' },
        { question: 'Are my files safe?', answer: 'Yes. Files are transferred over HTTPS, processed temporarily and deleted automatically within 30 minutes.' },
      ],
    },
    es: {
      intro:
        'Las herramientas de edición de FlowToPDF cubren todo lo que haces con un PDF existente: unir varios archivos en uno, dividir un PDF por rangos de página o extraer páginas sueltas, comprimir un PDF grande para que entre en el límite de un correo, rotar páginas, añadir o quitar una contraseña, y aplicar OCR para hacer buscables las páginas escaneadas. Cada herramienta funciona gratis en tu navegador, sin registro, sin marca de agua y con borrado automático en 30 minutos. Sube archivos de hasta 50 MB (unir combina hasta 20 archivos) y descarga el resultado en segundos.',
      whyUse: [
        { title: 'Combinar o dividir documentos', description: 'Une capítulos y escaneos en un archivo, o divide un PDF largo en partes más pequeñas.' },
        { title: 'Hacer enviables los PDFs grandes', description: 'Comprime un PDF pesado para que entre en el límite de 25 MB de Gmail o 20 MB de Outlook.' },
        { title: 'Corregir y proteger páginas', description: 'Rota escaneos de lado, añade contraseña a archivos sensibles o desbloquea los tuyos.' },
        { title: 'Buscar en documentos escaneados', description: 'El OCR añade una capa de texto real para encontrar nombres, cláusulas y fechas en escaneos.' },
      ],
      faqs: [
        { question: '¿Cómo divido un PDF en archivos separados?', answer: 'Abre Dividir PDF, elige "extraer cada página" o introduce rangos como "1-3, 5, 7-9" y descarga las partes como PDFs individuales o un ZIP.' },
        { question: '¿Cómo uno archivos PDF?', answer: 'Usa Unir PDF para combinar hasta 20 archivos. Arrastra para ordenarlos y descarga un único PDF combinado.' },
        { question: '¿Cuánto puedo comprimir un PDF?', answer: 'Los PDFs con muchas imágenes pueden reducir 50-80%. Los de solo texto bajan menos porque el texto ya es compacto. El texto se mantiene nítido en todos los niveles.' },
        { question: '¿Estas herramientas PDF son gratis?', answer: 'Sí — unir, dividir, comprimir, rotar, proteger, desbloquear y OCR son gratis, sin registro ni marca de agua.' },
        { question: '¿Cuál es el tamaño máximo de archivo?', answer: 'Hasta 50 MB por archivo (unir combina hasta 20 archivos). Divide primero un PDF más grande si hace falta.' },
        { question: '¿Están seguros mis archivos?', answer: 'Sí. Los archivos se transfieren por HTTPS, se procesan temporalmente y se eliminan automáticamente en 30 minutos.' },
      ],
    },
  },

  // ─── Office to PDF ──────────────────────────────────────────────────────────
  'office-to-pdf': {
    en: {
      intro:
        'Convert Microsoft Office and OpenDocument files to PDF with FlowToPDF. Turn Word (.doc, .docx), Excel, PowerPoint, ODT and RTF documents into a fixed-layout PDF that looks identical on any device, ready to email, print or archive. The conversion preserves headings, fonts, tables, page breaks and embedded images. It runs free in your browser with no signup, no watermark, and automatic deletion within 30 minutes — upload a file up to 50 MB and download the PDF in seconds.',
      whyUse: [
        { title: 'Send a document that looks the same everywhere', description: 'PDFs render identically regardless of the recipient\'s software or Office version.' },
        { title: 'Meet PDF-only submission rules', description: 'Application portals and forms usually require PDF, not .docx or .pptx.' },
        { title: 'Lock the layout before sharing', description: 'A PDF is harder to alter, so the document you sign or send stays intact.' },
        { title: 'Archive for the long term', description: 'PDFs stay readable for years, while Office files can shift formatting between versions.' },
      ],
      faqs: [
        { question: 'Which Office formats can I convert to PDF?', answer: 'Word (.doc, .docx), Excel, PowerPoint, ODT and RTF. Each converts to a faithful, fixed-layout PDF.' },
        { question: 'Does the PDF look exactly like the Office file?', answer: 'Yes for standard documents — headings, fonts, tables and images are preserved. Rare custom fonts may be substituted.' },
        { question: 'Is Office to PDF free?', answer: 'Yes — completely free with no signup, no watermark and no daily limit.' },
        { question: 'Can I convert on my phone?', answer: 'Yes. Everything runs in the browser, so it works on desktop, tablet and mobile.' },
        { question: 'What is the maximum file size?', answer: 'Up to 50 MB per file. Files are processed over HTTPS and deleted automatically within 30 minutes.' },
      ],
    },
    es: {
      intro:
        'Convierte archivos de Microsoft Office y OpenDocument a PDF con FlowToPDF. Transforma documentos de Word (.doc, .docx), Excel, PowerPoint, ODT y RTF en un PDF de diseño fijo que se ve igual en cualquier dispositivo, listo para enviar, imprimir o archivar. La conversión conserva encabezados, fuentes, tablas, saltos de página e imágenes embebidas. Funciona gratis en tu navegador, sin registro, sin marca de agua y con borrado automático en 30 minutos — sube un archivo de hasta 50 MB y descarga el PDF en segundos.',
      whyUse: [
        { title: 'Enviar un documento que se ve igual en todas partes', description: 'Los PDFs se muestran idénticos sin importar el software o la versión de Office del destinatario.' },
        { title: 'Cumplir reglas de "solo PDF"', description: 'Los portales y formularios suelen exigir PDF, no .docx ni .pptx.' },
        { title: 'Bloquear el diseño antes de compartir', description: 'Un PDF es más difícil de alterar, así que lo que firmes o envíes queda intacto.' },
        { title: 'Archivar a largo plazo', description: 'Los PDFs siguen siendo legibles durante años, mientras que los Office pueden cambiar de formato entre versiones.' },
      ],
      faqs: [
        { question: '¿Qué formatos de Office puedo convertir a PDF?', answer: 'Word (.doc, .docx), Excel, PowerPoint, ODT y RTF. Cada uno se convierte en un PDF fiel de diseño fijo.' },
        { question: '¿El PDF se ve exactamente como el archivo de Office?', answer: 'Sí en documentos estándar — se conservan encabezados, fuentes, tablas e imágenes. Las fuentes personalizadas raras pueden sustituirse.' },
        { question: '¿Office a PDF es gratis?', answer: 'Sí — completamente gratis, sin registro, sin marca de agua y sin límite diario.' },
        { question: '¿Puedo convertir desde el móvil?', answer: 'Sí. Todo funciona en el navegador, así que sirve en ordenador, tablet y móvil.' },
        { question: '¿Cuál es el tamaño máximo de archivo?', answer: 'Hasta 50 MB por archivo. Los archivos se procesan por HTTPS y se eliminan automáticamente en 30 minutos.' },
      ],
    },
  },
};

/**
 * Look up SEO content for a category by ID. Returns undefined if not found.
 */
export function getCategorySeoContent(categoryId: string, lang: 'en' | 'es'): CategorySeoSection | undefined {
  const content = categorySeoContent[categoryId];
  if (!content) return undefined;
  return content[lang];
}
