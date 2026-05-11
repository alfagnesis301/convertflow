/**
 * Tool-specific long-form SEO content.
 *
 * This data is consumed by:
 *   1. The React ToolPage component (runtime, hydrated UI)
 *   2. The post-build prerender script (build time, static HTML for crawlers)
 *
 * Both consumers render the same content so users and Google see identical pages.
 */

export interface ToolSeoSection {
  /** Long descriptive paragraph about what the tool does and why someone would use it */
  intro: string;
  /** 3-4 concrete real-world use cases */
  useCases: { title: string; description: string }[];
  /** 4-6 FAQ pairs that match what users actually search */
  faqs: { question: string; answer: string }[];
  /** Plain-language note about the conversion's limitations or quality */
  limitations?: string;
}

export interface ToolSeoContent {
  en: ToolSeoSection;
  es: ToolSeoSection;
}

export const toolSeoContent: Record<string, ToolSeoContent> = {
  // ─── PDF to Word ──────────────────────────────────────────────────────────
  'pdf-to-word': {
    en: {
      intro:
        'Convert PDF files to fully editable Microsoft Word documents (.docx) while preserving the original layout, fonts, tables, and images. FlowToPDF processes your PDF directly in the cloud — no installation, no account, and your file is automatically deleted within 30 minutes.',
      useCases: [
        { title: 'Edit a contract or agreement', description: 'Open the converted .docx in Word, make the changes, and re-export to PDF when ready to sign.' },
        { title: 'Reuse content from a report', description: 'Pull paragraphs, tables, or chart data out of a PDF and into a new document without retyping.' },
        { title: 'Translate or update legacy documents', description: 'Convert older PDFs you no longer have the source file for into editable Word docs.' },
        { title: 'Prepare a draft for review', description: 'Send colleagues a Word doc with tracked changes instead of an uneditable PDF.' },
      ],
      faqs: [
        { question: 'Is the formatting preserved when converting PDF to Word?', answer: 'Yes for most documents. Layout, fonts, headings, tables and inline images are kept. Highly designed PDFs (magazines, infographics) may need light cleanup after conversion.' },
        { question: 'Can I convert a scanned PDF to Word?', answer: 'Scanned PDFs contain images of text rather than real text. For those you need OCR first — use our OCR PDF tool, then run PDF to Word on the OCRed file.' },
        { question: 'What is the maximum PDF size I can convert?', answer: 'Up to 50 MB per file on the free tier. For larger PDFs, split them first using our Split PDF tool.' },
        { question: 'Will my PDF stay private?', answer: 'Yes. Files are uploaded over HTTPS, processed in an isolated temporary directory, never read by humans, and automatically deleted within 30 minutes.' },
        { question: 'Does it work on Mac, Windows and Linux?', answer: 'Yes — FlowToPDF runs entirely in your browser, so it works on any operating system with no installation.' },
        { question: 'Is PDF to Word really free?', answer: 'Completely free. No subscription, no watermark, no signup, and no daily limit on the number of conversions.' },
      ],
      limitations: 'PDFs created from scanned images will produce a Word document with images of text instead of editable text. Use OCR first for those.',
    },
    es: {
      intro:
        'Convierte archivos PDF a documentos de Microsoft Word (.docx) totalmente editables conservando el diseño, las fuentes, las tablas y las imágenes originales. FlowToPDF procesa tu PDF directamente en la nube: sin instalación, sin cuenta, y tu archivo se elimina automáticamente en 30 minutos.',
      useCases: [
        { title: 'Editar un contrato o acuerdo', description: 'Abre el .docx convertido en Word, haz los cambios y exporta otra vez a PDF cuando esté listo para firmar.' },
        { title: 'Reutilizar contenido de un informe', description: 'Extrae párrafos, tablas o datos de gráficos de un PDF a un documento nuevo sin reescribirlos.' },
        { title: 'Traducir o actualizar documentos antiguos', description: 'Convierte PDFs antiguos cuyo archivo fuente ya no tienes a documentos de Word editables.' },
        { title: 'Preparar un borrador para revisión', description: 'Envía a tu equipo un Word con control de cambios en lugar de un PDF cerrado.' },
      ],
      faqs: [
        { question: '¿Se conserva el formato al convertir PDF a Word?', answer: 'Sí para la mayoría de documentos. Se mantienen el diseño, fuentes, encabezados, tablas e imágenes. Los PDFs muy diseñados (revistas, infografías) pueden necesitar pequeños retoques.' },
        { question: '¿Puedo convertir un PDF escaneado a Word?', answer: 'Los PDFs escaneados contienen imágenes de texto en lugar de texto real. Para esos casos primero necesitas OCR: usa nuestra herramienta OCR PDF y luego PDF a Word sobre el resultado.' },
        { question: '¿Cuál es el tamaño máximo de PDF?', answer: 'Hasta 50 MB por archivo en la versión gratuita. Para PDFs más grandes, divídelos primero con nuestra herramienta Dividir PDF.' },
        { question: '¿Mi PDF se mantiene privado?', answer: 'Sí. Los archivos se suben por HTTPS, se procesan en un directorio temporal aislado, nunca son leídos por personas y se eliminan automáticamente en 30 minutos.' },
        { question: '¿Funciona en Mac, Windows y Linux?', answer: 'Sí — FlowToPDF se ejecuta completamente en tu navegador, por lo que funciona en cualquier sistema operativo sin instalación.' },
        { question: '¿PDF a Word es realmente gratis?', answer: 'Totalmente gratis. Sin suscripción, sin marca de agua, sin registro y sin límite diario en el número de conversiones.' },
      ],
      limitations: 'Los PDFs creados a partir de imágenes escaneadas producirán un Word con imágenes de texto en lugar de texto editable. Para esos casos, usa OCR primero.',
    },
  },

  // ─── Word to PDF ──────────────────────────────────────────────────────────
  'word-to-pdf': {
    en: {
      intro:
        'Turn Microsoft Word documents (.doc, .docx) into universally compatible PDF files. The converted PDF preserves your headings, fonts, tables, page breaks and embedded images exactly as they appear in Word, ready to email, print, or archive.',
      useCases: [
        { title: 'Send a professional document', description: 'Recipients see exactly what you designed, no matter what software or version of Word they use.' },
        { title: 'Submit a form or application', description: 'Most online application portals only accept PDF — convert your Word file and upload.' },
        { title: 'Archive for the long term', description: 'PDFs render the same on any device, even decades later. Word files can shift formatting between versions.' },
        { title: 'Lock the content from accidental edits', description: 'A PDF is harder to alter, so the document you sign or share stays intact.' },
      ],
      faqs: [
        { question: 'Does the PDF look exactly like the Word document?', answer: 'Yes. We use the same conversion engine that LibreOffice uses, which produces a faithful 1:1 PDF including fonts, tables, and embedded images.' },
        { question: 'What Word file types are supported?', answer: 'Both modern .docx and legacy .doc are supported. We also support .odt (LibreOffice) and .rtf.' },
        { question: 'Will my fonts be preserved?', answer: 'Standard fonts are embedded in the PDF. Custom or rare fonts may be substituted with a similar one.' },
        { question: 'Can I add a password to the PDF?', answer: 'Yes — after converting, run the file through our Protect PDF tool to add a password.' },
        { question: 'Does it work for documents with comments and tracked changes?', answer: 'Yes, but those are flattened into the PDF. The PDF reflects the document as it would print.' },
      ],
    },
    es: {
      intro:
        'Convierte documentos de Microsoft Word (.doc, .docx) a archivos PDF universalmente compatibles. El PDF resultante mantiene los encabezados, fuentes, tablas, saltos de página e imágenes embebidas tal como aparecen en Word, listo para enviar, imprimir o archivar.',
      useCases: [
        { title: 'Enviar un documento profesional', description: 'El destinatario ve exactamente lo que diseñaste, sin importar qué software o versión de Word use.' },
        { title: 'Enviar un formulario o solicitud', description: 'La mayoría de portales online solo aceptan PDF — convierte tu Word y súbelo.' },
        { title: 'Archivar a largo plazo', description: 'Los PDFs se ven igual en cualquier dispositivo, incluso décadas después. Los Word pueden cambiar formato entre versiones.' },
        { title: 'Bloquear el contenido frente a ediciones accidentales', description: 'Un PDF es más difícil de alterar, así que lo que firmes o compartas queda intacto.' },
      ],
      faqs: [
        { question: '¿El PDF se ve exactamente como el documento Word?', answer: 'Sí. Usamos el mismo motor de conversión que LibreOffice, que produce un PDF fiel 1:1 incluyendo fuentes, tablas e imágenes.' },
        { question: '¿Qué tipos de archivo Word son compatibles?', answer: 'Tanto .docx moderno como .doc heredado. También soportamos .odt (LibreOffice) y .rtf.' },
        { question: '¿Se conservan mis fuentes?', answer: 'Las fuentes estándar se incrustan en el PDF. Las fuentes personalizadas o raras pueden sustituirse por una similar.' },
        { question: '¿Puedo añadir contraseña al PDF?', answer: 'Sí — después de convertir, pasa el archivo por nuestra herramienta Proteger PDF para añadir una contraseña.' },
        { question: '¿Funciona con documentos con comentarios y control de cambios?', answer: 'Sí, pero quedan aplanados en el PDF. El PDF refleja el documento tal como se imprimiría.' },
      ],
    },
  },

  // ─── Merge PDF ────────────────────────────────────────────────────────────
  'merge-pdf': {
    en: {
      intro:
        'Combine up to 20 PDF files into a single document, in the order you choose, in just a few seconds. Useful for assembling reports, bundling chapters, or merging scans of a multi-page document.',
      useCases: [
        { title: 'Combine scanned pages', description: 'Bundle separately scanned pages of an ID, contract, or receipt into one clean PDF.' },
        { title: 'Assemble a report', description: 'Merge cover page + body + appendix PDFs from different sources into one deliverable.' },
        { title: 'Group invoices for accounting', description: 'Combine a month of invoices into a single PDF for your records or accountant.' },
        { title: 'Submit a single application', description: 'Many forms require all attachments in one PDF — merge them in the right order.' },
      ],
      faqs: [
        { question: 'How many PDFs can I merge at once?', answer: 'Up to 20 PDF files in a single merge, with a combined limit of 50 MB.' },
        { question: 'Can I choose the order of pages?', answer: 'Yes — files are merged in the order you upload them. You can drag to rearrange before merging.' },
        { question: 'Does merging change page quality?', answer: 'No. Pages are copied byte-for-byte from the source PDFs, so quality and file size are preserved.' },
        { question: 'Are bookmarks or links preserved?', answer: 'Page-level content (text, images, links inside pages) is preserved. Document-level bookmarks are reset since pages are renumbered.' },
        { question: 'Is there a limit on how many times I can use this?', answer: 'No daily limit. Merge as many times as you need.' },
      ],
    },
    es: {
      intro:
        'Combina hasta 20 archivos PDF en un único documento, en el orden que tú elijas, en pocos segundos. Útil para montar informes, agrupar capítulos o unir escaneos de un documento de varias páginas.',
      useCases: [
        { title: 'Combinar páginas escaneadas', description: 'Agrupa páginas escaneadas por separado de un DNI, contrato o factura en un único PDF limpio.' },
        { title: 'Montar un informe', description: 'Une portada + cuerpo + anexos en PDFs separados en un único entregable.' },
        { title: 'Agrupar facturas para contabilidad', description: 'Combina un mes de facturas en un solo PDF para tu archivo o tu gestor.' },
        { title: 'Enviar una única solicitud', description: 'Muchos formularios exigen todos los anexos en un solo PDF — únelos en el orden correcto.' },
      ],
      faqs: [
        { question: '¿Cuántos PDFs puedo unir a la vez?', answer: 'Hasta 20 archivos PDF en una sola unión, con un límite combinado de 50 MB.' },
        { question: '¿Puedo elegir el orden de las páginas?', answer: 'Sí — los archivos se unen en el orden en que los subes. Puedes arrastrarlos para reordenarlos antes de unir.' },
        { question: '¿Unir cambia la calidad de las páginas?', answer: 'No. Las páginas se copian byte a byte del PDF de origen, así que calidad y tamaño se conservan.' },
        { question: '¿Se conservan marcadores y enlaces?', answer: 'El contenido a nivel de página (texto, imágenes, enlaces dentro de las páginas) se conserva. Los marcadores de documento se reinician porque las páginas se renumeran.' },
        { question: '¿Hay límite de uso?', answer: 'Sin límite diario. Une cuantas veces necesites.' },
      ],
    },
  },

  // ─── Compress PDF ─────────────────────────────────────────────────────────
  'compress-pdf': {
    en: {
      intro:
        'Reduce the file size of a PDF without sacrificing readable quality. Useful when a PDF is too large to email, too slow to upload, or needs to fit a portal\'s size limit. Choose between low, medium, or high compression depending on how aggressive you want the optimisation to be.',
      useCases: [
        { title: 'Email a large PDF', description: 'Many email providers limit attachments to 25 MB — compress to fit.' },
        { title: 'Upload to a web portal', description: 'Some upload forms cap PDFs at 5 or 10 MB — high compression usually solves it.' },
        { title: 'Share over WhatsApp or messaging apps', description: 'Reduce a multi-MB PDF to something that sends quickly on mobile data.' },
        { title: 'Save storage on your computer or cloud', description: 'Compress old PDFs in bulk to free up space without losing content.' },
      ],
      faqs: [
        { question: 'How much can I compress a PDF?', answer: 'It depends on the PDF. Image-heavy PDFs can shrink 50–80%. Text-only PDFs often shrink less because text is already compressed.' },
        { question: 'Will compressing reduce the quality of my PDF?', answer: 'Low compression is essentially lossless. Medium and high re-encode embedded images at a lower quality, which may be visible if you zoom in.' },
        { question: 'Does compressing affect text quality?', answer: 'No. Text remains crisp at all compression levels because it is stored as vectors, not images.' },
        { question: 'Can I compress a password-protected PDF?', answer: 'You need to unlock it first using our Unlock PDF tool, then compress.' },
        { question: 'Is there a limit on PDF size?', answer: 'Up to 50 MB per file. Larger PDFs should be split first.' },
      ],
    },
    es: {
      intro:
        'Reduce el tamaño de un PDF sin sacrificar la calidad legible. Útil cuando un PDF es demasiado grande para enviar por correo, demasiado lento para subir, o necesita ajustarse al límite de un portal. Elige entre compresión baja, media o alta según lo agresiva que quieras que sea la optimización.',
      useCases: [
        { title: 'Enviar un PDF grande por correo', description: 'Muchos proveedores de correo limitan los adjuntos a 25 MB — comprime para que entre.' },
        { title: 'Subirlo a un portal web', description: 'Algunos formularios limitan PDFs a 5 o 10 MB — la compresión alta suele resolverlo.' },
        { title: 'Compartir por WhatsApp', description: 'Reduce un PDF de varios MB a algo que se envíe rápido por datos móviles.' },
        { title: 'Ahorrar espacio', description: 'Comprime PDFs antiguos en lote para liberar espacio sin perder contenido.' },
      ],
      faqs: [
        { question: '¿Cuánto puedo comprimir un PDF?', answer: 'Depende del PDF. Los PDFs con muchas imágenes pueden reducir 50–80%. Los de solo texto bajan menos porque el texto ya está comprimido.' },
        { question: '¿Comprimir reduce la calidad de mi PDF?', answer: 'Compresión baja es prácticamente sin pérdida. Media y alta recodifican las imágenes embebidas a menor calidad, lo cual puede verse al hacer zoom.' },
        { question: '¿Afecta a la calidad del texto?', answer: 'No. El texto se mantiene nítido en todos los niveles porque se guarda como vectores, no como imagen.' },
        { question: '¿Puedo comprimir un PDF protegido con contraseña?', answer: 'Primero debes desbloquearlo con nuestra herramienta Desbloquear PDF y luego comprimirlo.' },
        { question: '¿Hay límite de tamaño?', answer: 'Hasta 50 MB por archivo. Los PDFs más grandes deberían dividirse primero.' },
      ],
    },
  },

  // ─── JPG to PDF ───────────────────────────────────────────────────────────
  'jpg-to-pdf': {
    en: {
      intro:
        'Convert JPG (or JPEG) images into a single PDF document. You can upload one image or many at once, choose the page size (A4, Letter, Legal or auto-fit), and pick portrait or landscape orientation. Each image becomes one page in the resulting PDF.',
      useCases: [
        { title: 'Build a digital portfolio', description: 'Combine product photos or design renders into a single PDF for clients.' },
        { title: 'Send scanned receipts to your accountant', description: 'Photograph each receipt and bundle them into one PDF for expense reports.' },
        { title: 'Submit photo IDs in one file', description: 'Most KYC forms ask for ID photos as a single PDF, not individual images.' },
        { title: 'Archive photos with text', description: 'Make a printable PDF album from a folder of phone photos.' },
      ],
      faqs: [
        { question: 'Can I upload multiple JPGs at once?', answer: 'Yes — drag in multiple files or select several. They become consecutive pages in the PDF in the order shown.' },
        { question: 'Do I need to resize my images first?', answer: 'No. The tool will fit each image to the page size you choose. With "Auto" page size, the PDF page matches the image dimensions exactly.' },
        { question: 'Will the conversion lose quality?', answer: 'No re-encoding happens. Your JPG is embedded as-is in the PDF, so quality matches the original image.' },
        { question: 'What page sizes are available?', answer: 'A4, US Letter, US Legal, or Auto (fit to image). Plus portrait or landscape orientation.' },
        { question: 'Are PNG, GIF and WEBP also supported?', answer: 'Yes — use our PNG to PDF, GIF to PDF or WEBP to PDF tools, or just upload them on this page (we accept any common image format).' },
      ],
    },
    es: {
      intro:
        'Convierte imágenes JPG (o JPEG) en un único documento PDF. Puedes subir una imagen o muchas a la vez, elegir el tamaño de página (A4, Carta, Legal o ajuste automático) y orientación vertical u horizontal. Cada imagen se convierte en una página del PDF resultante.',
      useCases: [
        { title: 'Crear un portfolio digital', description: 'Combina fotos de productos o renders de diseño en un solo PDF para clientes.' },
        { title: 'Enviar recibos escaneados al gestor', description: 'Fotografía cada recibo y agrúpalos en un PDF para tu informe de gastos.' },
        { title: 'Enviar documentos de identidad en un único archivo', description: 'La mayoría de formularios KYC piden fotos del DNI como un solo PDF.' },
        { title: 'Archivar fotos con texto', description: 'Crea un álbum imprimible en PDF desde una carpeta de fotos del móvil.' },
      ],
      faqs: [
        { question: '¿Puedo subir varias JPG a la vez?', answer: 'Sí — arrastra varios archivos o selecciónalos. Pasan a ser páginas consecutivas del PDF en el orden mostrado.' },
        { question: '¿Necesito redimensionar las imágenes antes?', answer: 'No. La herramienta ajusta cada imagen al tamaño de página elegido. Con tamaño "Auto", la página del PDF coincide exactamente con las dimensiones de la imagen.' },
        { question: '¿Se pierde calidad al convertir?', answer: 'No hay recodificación. Tu JPG se incrusta tal cual en el PDF, así que la calidad coincide con la imagen original.' },
        { question: '¿Qué tamaños de página hay?', answer: 'A4, Carta US, Legal US, o Auto (ajustar a imagen). Más orientación vertical u horizontal.' },
        { question: '¿Se admiten PNG, GIF y WEBP?', answer: 'Sí — usa nuestras herramientas PNG a PDF, GIF a PDF o WEBP a PDF, o súbelos en esta página (aceptamos cualquier formato común de imagen).' },
      ],
    },
  },

  // ─── PDF to JPG ───────────────────────────────────────────────────────────
  'pdf-to-jpg': {
    en: {
      intro:
        'Extract every page of a PDF as a high-resolution JPG image. Choose between low (72 dpi), medium (150 dpi) or high (300 dpi) quality depending on whether the images are for the web or for printing. If your PDF has multiple pages, you\'ll receive a ZIP with one JPG per page.',
      useCases: [
        { title: 'Use PDF pages as images', description: 'Drop a slide or chart from a PDF into a presentation, blog post, or social media post.' },
        { title: 'Preview a PDF on the web', description: 'Embed the first page as a JPG to give visitors a preview without forcing a download.' },
        { title: 'Print pages from a phone', description: 'Some mobile printers handle JPG better than PDF.' },
        { title: 'Share a single page', description: 'Convert just the page you need to JPG instead of sending the whole PDF.' },
      ],
      faqs: [
        { question: 'What quality should I choose?', answer: 'Use Low (72 dpi) for web previews, Medium (150 dpi) for screens and email, High (300 dpi) for printing.' },
        { question: 'Will I get one JPG or several?', answer: 'One JPG per page in the PDF. If the PDF has multiple pages you\'ll get a ZIP archive containing all the images.' },
        { question: 'Can I extract just one specific page?', answer: 'Yes — first use our Extract Pages tool to pull only the page you need, then convert that single-page PDF to JPG.' },
        { question: 'Does the JPG keep transparency?', answer: 'JPG does not support transparency. Use our PDF to PNG tool if you need a transparent background.' },
        { question: 'What if my PDF is password-protected?', answer: 'Unlock it first with our Unlock PDF tool, then run PDF to JPG.' },
      ],
      limitations: 'PDF to JPG requires Poppler on the server. If the rasterisation engine is unavailable on this deployment, you\'ll see a clear error and can install it locally.',
    },
    es: {
      intro:
        'Extrae cada página de un PDF como imagen JPG de alta resolución. Elige entre calidad baja (72 dpi), media (150 dpi) o alta (300 dpi) según si las imágenes son para web o impresión. Si tu PDF tiene varias páginas, recibirás un ZIP con un JPG por página.',
      useCases: [
        { title: 'Usar páginas del PDF como imágenes', description: 'Coloca una diapositiva o un gráfico de un PDF en una presentación, post de blog o publicación social.' },
        { title: 'Previsualizar un PDF en la web', description: 'Embebe la primera página como JPG para dar una previsualización sin forzar la descarga.' },
        { title: 'Imprimir desde el móvil', description: 'Algunas impresoras móviles manejan mejor JPG que PDF.' },
        { title: 'Compartir una sola página', description: 'Convierte solo la página que necesitas a JPG en lugar de enviar el PDF entero.' },
      ],
      faqs: [
        { question: '¿Qué calidad elijo?', answer: 'Baja (72 dpi) para previsualización web, Media (150 dpi) para pantalla y correo, Alta (300 dpi) para imprimir.' },
        { question: '¿Recibiré un JPG o varios?', answer: 'Un JPG por página del PDF. Si tiene varias, recibirás un ZIP con todas las imágenes.' },
        { question: '¿Puedo extraer solo una página específica?', answer: 'Sí — primero usa nuestra herramienta Extraer Páginas para obtener solo la página que necesitas y luego convierte ese PDF a JPG.' },
        { question: '¿El JPG mantiene la transparencia?', answer: 'JPG no admite transparencia. Usa nuestra herramienta PDF a PNG si necesitas fondo transparente.' },
        { question: '¿Y si mi PDF tiene contraseña?', answer: 'Desbloquéalo primero con Desbloquear PDF y luego ejecuta PDF a JPG.' },
      ],
      limitations: 'PDF a JPG requiere Poppler en el servidor. Si el motor de rasterización no está disponible en este deploy, verás un error claro.',
    },
  },

  // ─── Split PDF ────────────────────────────────────────────────────────────
  'split-pdf': {
    en: {
      intro:
        'Break a PDF into smaller files. Choose between extracting every page as a separate PDF, or specify custom page ranges like "1-3, 5, 7-9" to control exactly how the document is divided.',
      useCases: [
        { title: 'Pull out a single chapter', description: 'Extract chapter 5 from a 200-page book PDF into its own file.' },
        { title: 'Separate scanned documents', description: 'You scanned three contracts as one PDF — split them into individual files.' },
        { title: 'Make a long PDF emailable', description: 'Split a 100 MB PDF into 10 MB chunks so each part fits an email attachment limit.' },
        { title: 'Share only relevant pages', description: 'Send a colleague pages 12-15 of a report without exposing the whole document.' },
      ],
      faqs: [
        { question: 'How do I specify page ranges?', answer: 'Use comma-separated ranges, e.g. "1-3, 5, 7-9" gives you three PDFs: pages 1–3, page 5, and pages 7–9.' },
        { question: 'What does "extract every page" do?', answer: 'It produces one separate PDF per page of the original. A 10-page PDF becomes 10 files in a ZIP.' },
        { question: 'Will splitting reduce quality?', answer: 'No. Pages are copied byte-for-byte from the source PDF, so quality and resolution are identical.' },
        { question: 'Can I split a password-protected PDF?', answer: 'Unlock it first using our Unlock PDF tool.' },
        { question: 'Do I get a ZIP or individual PDFs?', answer: 'If the result is one file, you get a single PDF. If multiple, they\'re bundled in a ZIP.' },
      ],
    },
    es: {
      intro:
        'Divide un PDF en archivos más pequeños. Elige entre extraer cada página como PDF independiente o especificar rangos personalizados como "1-3, 5, 7-9" para controlar exactamente cómo se divide.',
      useCases: [
        { title: 'Extraer un solo capítulo', description: 'Saca el capítulo 5 de un PDF de libro de 200 páginas a su propio archivo.' },
        { title: 'Separar documentos escaneados', description: 'Escaneaste tres contratos como un PDF — divídelos en archivos individuales.' },
        { title: 'Hacer enviable un PDF largo', description: 'Divide un PDF de 100 MB en trozos de 10 MB para que cada parte pase el límite de un correo.' },
        { title: 'Compartir solo páginas relevantes', description: 'Envía a un compañero las páginas 12-15 sin exponer todo el documento.' },
      ],
      faqs: [
        { question: '¿Cómo especifico rangos de página?', answer: 'Rangos separados por coma, p. ej. "1-3, 5, 7-9" te da tres PDFs: páginas 1–3, página 5 y páginas 7–9.' },
        { question: '¿Qué hace "extraer cada página"?', answer: 'Produce un PDF independiente por cada página del original. Un PDF de 10 páginas se convierte en 10 archivos en un ZIP.' },
        { question: '¿Dividir reduce la calidad?', answer: 'No. Las páginas se copian byte a byte del PDF de origen, así que la calidad y resolución son idénticas.' },
        { question: '¿Puedo dividir un PDF con contraseña?', answer: 'Desbloquéalo primero con Desbloquear PDF.' },
        { question: '¿Recibo un ZIP o PDFs individuales?', answer: 'Si el resultado es un archivo, recibes un PDF. Si son varios, vienen en un ZIP.' },
      ],
    },
  },

  // ─── Rotate PDF ───────────────────────────────────────────────────────────
  'rotate-pdf': {
    en: {
      intro:
        'Rotate all pages — or only specific ones — of a PDF by 90, 180, or 270 degrees. The rotation is permanent and saved into the PDF, so it displays correctly anywhere it\'s opened.',
      useCases: [
        { title: 'Fix sideways scans', description: 'A scanner picked up some pages in landscape — rotate them 90° so the whole document reads upright.' },
        { title: 'Match your screen orientation', description: 'A PDF that\'s easier to read sideways on a wide monitor.' },
        { title: 'Correct a phone-camera capture', description: 'A photo-based PDF taken with the phone tilted — rotate to upright.' },
      ],
      faqs: [
        { question: 'Can I rotate just a few pages?', answer: 'Yes. Specify page numbers in the "Pages to Rotate" field (e.g. "1, 3-5"). Leave it blank to rotate every page.' },
        { question: 'Is the rotation reversible?', answer: 'Run the tool again with the opposite rotation (e.g. apply 270° to undo a 90° rotation).' },
        { question: 'Does rotating change quality?', answer: 'No. The rotation is metadata, so the underlying content is untouched.' },
      ],
    },
    es: {
      intro:
        'Rota todas las páginas — o solo algunas — de un PDF en 90, 180 o 270 grados. La rotación es permanente y se guarda en el PDF, así que se ve correcta donde sea que se abra.',
      useCases: [
        { title: 'Corregir escaneos de lado', description: 'El escáner cogió algunas páginas en horizontal — rótalas 90° para que todo el documento se lea vertical.' },
        { title: 'Adaptar a la orientación de pantalla', description: 'Un PDF más fácil de leer de lado en un monitor ancho.' },
        { title: 'Arreglar fotos hechas con el móvil inclinado', description: 'Una captura del móvil torcida — rótala a vertical.' },
      ],
      faqs: [
        { question: '¿Puedo rotar solo algunas páginas?', answer: 'Sí. Especifica los números de página en el campo "Páginas a Rotar" (p. ej. "1, 3-5"). Déjalo en blanco para rotar todas.' },
        { question: '¿La rotación es reversible?', answer: 'Ejecuta la herramienta de nuevo con la rotación opuesta (p. ej. aplica 270° para deshacer una de 90°).' },
        { question: '¿Rotar cambia la calidad?', answer: 'No. La rotación es metadato, así que el contenido subyacente no se toca.' },
      ],
    },
  },

  // ─── Protect PDF ──────────────────────────────────────────────────────────
  'protect-pdf': {
    en: {
      intro:
        'Add a password to a PDF so it can only be opened by people who know it. Useful for sending sensitive documents over email or storing confidential files in shared cloud folders.',
      useCases: [
        { title: 'Protect a financial statement', description: 'Add a password before emailing bank statements, tax returns, or invoices.' },
        { title: 'Secure HR or legal documents', description: 'Contracts, NDAs, and personnel files should not be readable by anyone who finds the email.' },
        { title: 'Share over a public channel', description: 'Posting a PDF link in a chat? A password keeps it private even if the link leaks.' },
      ],
      faqs: [
        { question: 'What kind of password protection is used?', answer: 'A standard PDF user password (RC4-128). Most PDF readers will prompt for it on open.' },
        { question: 'What if I forget the password?', answer: 'There is no recovery. Pick a password you can remember or store it in a password manager.' },
        { question: 'Can I remove the password later?', answer: 'Yes — use our Unlock PDF tool with the correct password to remove it.' },
        { question: 'Is the password sent to your servers?', answer: 'It is used in-memory to encrypt the PDF and is then discarded. We never store passwords.' },
      ],
    },
    es: {
      intro:
        'Añade contraseña a un PDF para que solo lo abran quienes la conozcan. Útil para enviar documentos sensibles por correo o guardar archivos confidenciales en carpetas compartidas.',
      useCases: [
        { title: 'Proteger un extracto bancario', description: 'Añade contraseña antes de enviar extractos, declaraciones de impuestos o facturas.' },
        { title: 'Asegurar documentos de RRHH o legales', description: 'Contratos, NDAs y expedientes no deberían ser legibles por quien encuentre el correo.' },
        { title: 'Compartir por un canal público', description: '¿Publicas un enlace a un PDF en un chat? Una contraseña lo mantiene privado aunque el enlace se filtre.' },
      ],
      faqs: [
        { question: '¿Qué protección de contraseña se usa?', answer: 'Una contraseña de usuario PDF estándar (RC4-128). La mayoría de lectores la pedirán al abrir.' },
        { question: '¿Y si olvido la contraseña?', answer: 'No hay recuperación. Elige una contraseña que recuerdes o guárdala en un gestor de contraseñas.' },
        { question: '¿Puedo quitar la contraseña después?', answer: 'Sí — usa nuestra herramienta Desbloquear PDF con la contraseña correcta para quitarla.' },
        { question: '¿La contraseña se envía a vuestros servidores?', answer: 'Se usa en memoria para cifrar el PDF y luego se descarta. Nunca guardamos contraseñas.' },
      ],
    },
  },

  // ─── Unlock PDF ───────────────────────────────────────────────────────────
  'unlock-pdf': {
    en: {
      intro:
        'Remove the password from a PDF so it opens without prompting. You need to know the current password — this tool does not crack or guess passwords.',
      useCases: [
        { title: 'Stop entering the password every time', description: 'A PDF you reference often shouldn\'t require typing the password on every open.' },
        { title: 'Prepare a PDF for editing', description: 'Most PDF editors won\'t modify a protected file — unlock it first.' },
        { title: 'Combine with other tools', description: 'Compress, merge, and convert tools all need an unlocked PDF as input.' },
      ],
      faqs: [
        { question: 'Can this remove a password I don\'t know?', answer: 'No. You need the correct password. We do not provide tools for cracking PDFs.' },
        { question: 'Is the unlocked file the same as the original?', answer: 'Yes, except the password protection is removed. All content, formatting, and metadata are preserved.' },
        { question: 'Is my password kept?', answer: 'It is used in-memory to decrypt and then discarded. The unlocked PDF is downloaded and the file is deleted within 30 minutes.' },
      ],
    },
    es: {
      intro:
        'Elimina la contraseña de un PDF para que se abra sin pedirla. Necesitas conocer la contraseña actual — esta herramienta no rompe ni adivina contraseñas.',
      useCases: [
        { title: 'Dejar de introducir la contraseña siempre', description: 'Un PDF de consulta frecuente no debería pedir contraseña cada vez que se abre.' },
        { title: 'Preparar un PDF para edición', description: 'La mayoría de editores PDF no modifican un archivo protegido — desbloquéalo primero.' },
        { title: 'Combinar con otras herramientas', description: 'Comprimir, unir y convertir requieren un PDF desbloqueado.' },
      ],
      faqs: [
        { question: '¿Puede quitar una contraseña que no conozco?', answer: 'No. Necesitas la contraseña correcta. No ofrecemos herramientas para romper PDFs.' },
        { question: '¿El archivo desbloqueado es igual al original?', answer: 'Sí, salvo que se elimina la protección. Todo el contenido, formato y metadatos se conservan.' },
        { question: '¿Se guarda mi contraseña?', answer: 'Se usa en memoria para descifrar y luego se descarta. El PDF desbloqueado se descarga y el archivo se elimina en 30 minutos.' },
      ],
    },
  },

  'text-to-pdf': {
    en: {
      intro:
        'Convert plain text files into clean, readable PDF documents with consistent margins, page size and line wrapping. This tool is useful when you need to preserve notes, logs, transcripts, drafts or code snippets as a shareable PDF without opening a word processor.',
      useCases: [
        { title: 'Archive notes or transcripts', description: 'Turn meeting notes, interview transcripts or exported text into a stable PDF for storage.' },
        { title: 'Share logs with support teams', description: 'Package plain-text logs into a PDF that is easy to attach, review and annotate.' },
        { title: 'Create printable drafts', description: 'Convert a simple .txt draft into a paginated PDF before printing or sending for review.' },
        { title: 'Preserve plain-text records', description: 'Keep text exports readable across devices without changing the original content.' },
      ],
      faqs: [
        { question: 'What text files can I convert to PDF?', answer: 'You can upload standard .txt files encoded as plain text. For Markdown or HTML, use the dedicated Markdown to PDF or HTML to PDF tools.' },
        { question: 'Can I choose the page size?', answer: 'Yes. You can choose common page sizes such as A4 or Letter and adjust margins before converting.' },
        { question: 'Does the tool change my text?', answer: 'No. The text content is preserved. Long lines may wrap to fit the selected page width.' },
        { question: 'Can I convert code or log files?', answer: 'Yes, as long as they are plain text. Very wide lines may wrap across multiple visual lines in the PDF.' },
        { question: 'Are uploaded text files private?', answer: 'Yes. Files are uploaded over HTTPS, processed temporarily and automatically deleted within 30 minutes.' },
      ],
      limitations: 'Plain text does not contain rich formatting, images or tables. If you need headings, links or styled content, use Markdown to PDF or HTML to PDF instead.',
    },
    es: {
      intro:
        'Convierte archivos de texto plano en documentos PDF limpios y legibles con márgenes, tamaño de página y ajuste de línea consistentes. Es útil para conservar notas, registros, transcripciones, borradores o fragmentos de código como PDF compartible sin abrir un procesador de texto.',
      useCases: [
        { title: 'Archivar notas o transcripciones', description: 'Convierte notas de reuniones, entrevistas o exportaciones de texto en un PDF estable para guardar.' },
        { title: 'Compartir logs con soporte', description: 'Empaqueta registros de texto en un PDF fácil de adjuntar, revisar y anotar.' },
        { title: 'Crear borradores imprimibles', description: 'Convierte un borrador .txt sencillo en un PDF paginado antes de imprimirlo o enviarlo.' },
        { title: 'Preservar registros de texto', description: 'Mantén exportaciones de texto legibles en cualquier dispositivo sin cambiar el contenido.' },
      ],
      faqs: [
        { question: '¿Qué archivos de texto puedo convertir a PDF?', answer: 'Puedes subir archivos .txt estándar codificados como texto plano. Para Markdown o HTML, usa las herramientas Markdown a PDF o HTML a PDF.' },
        { question: '¿Puedo elegir el tamaño de página?', answer: 'Sí. Puedes elegir tamaños habituales como A4 o Carta y ajustar los márgenes antes de convertir.' },
        { question: '¿La herramienta cambia mi texto?', answer: 'No. El contenido se conserva. Las líneas largas pueden ajustarse al ancho de la página elegida.' },
        { question: '¿Puedo convertir código o archivos log?', answer: 'Sí, siempre que sean texto plano. Las líneas muy largas pueden dividirse visualmente en varias líneas en el PDF.' },
        { question: '¿Mis archivos de texto son privados?', answer: 'Sí. Se suben por HTTPS, se procesan temporalmente y se eliminan automáticamente en 30 minutos.' },
      ],
      limitations: 'El texto plano no contiene formato enriquecido, imágenes ni tablas. Si necesitas títulos, enlaces o estilos, usa Markdown a PDF o HTML a PDF.',
    },
  },

  'webp-to-pdf': {
    en: {
      intro:
        'Convert WebP images into a PDF document that is easier to print, archive or share with people whose devices do not support WebP well. Upload one image or combine several WebP files into a single PDF with your chosen page size, orientation and margins.',
      useCases: [
        { title: 'Share WebP images as a universal file', description: 'Package modern WebP images as a PDF that opens reliably on phones, desktops and document portals.' },
        { title: 'Create a printable image set', description: 'Turn downloaded WebP graphics, receipts or screenshots into a print-ready PDF.' },
        { title: 'Submit images to PDF-only forms', description: 'Many application portals accept PDFs but reject WebP uploads.' },
        { title: 'Archive web images', description: 'Store a group of WebP assets in one document while preserving visual quality.' },
      ],
      faqs: [
        { question: 'Can I convert multiple WebP files at once?', answer: 'Yes. Upload several WebP images and each one becomes a page in the final PDF.' },
        { question: 'Does WebP to PDF reduce quality?', answer: 'The image is embedded at high quality. Final appearance depends on the original WebP resolution and the page size you choose.' },
        { question: 'Can I set A4 or Letter page size?', answer: 'Yes. Choose Auto, A4, Letter or Legal, plus portrait or landscape orientation.' },
        { question: 'Will animated WebP files stay animated?', answer: 'No. PDF pages are static, so animated WebP files are converted using a still frame.' },
        { question: 'Are WebP files deleted after conversion?', answer: 'Yes. Uploaded images are processed temporarily and automatically deleted within 30 minutes.' },
      ],
      limitations: 'PDF is a static document format, so animation is not preserved. Very small WebP images may look pixelated if stretched to a large page size.',
    },
    es: {
      intro:
        'Convierte imágenes WebP en un documento PDF más fácil de imprimir, archivar o compartir con personas cuyos dispositivos no manejan bien WebP. Sube una imagen o combina varios archivos WebP en un único PDF con el tamaño de página, orientación y márgenes que elijas.',
      useCases: [
        { title: 'Compartir WebP como archivo universal', description: 'Empaqueta imágenes WebP modernas como PDF para que se abran bien en móviles, ordenadores y portales.' },
        { title: 'Crear un conjunto imprimible', description: 'Convierte gráficos, recibos o capturas WebP descargadas en un PDF listo para imprimir.' },
        { title: 'Enviar imágenes a formularios que solo aceptan PDF', description: 'Muchos portales aceptan PDFs pero rechazan subidas en WebP.' },
        { title: 'Archivar imágenes web', description: 'Guarda un grupo de recursos WebP en un solo documento conservando la calidad visual.' },
      ],
      faqs: [
        { question: '¿Puedo convertir varios WebP a la vez?', answer: 'Sí. Sube varias imágenes WebP y cada una será una página del PDF final.' },
        { question: '¿WebP a PDF reduce la calidad?', answer: 'La imagen se incrusta con alta calidad. El resultado depende de la resolución original y del tamaño de página elegido.' },
        { question: '¿Puedo elegir A4 o Carta?', answer: 'Sí. Puedes elegir Auto, A4, Carta o Legal, además de orientación vertical u horizontal.' },
        { question: '¿Los WebP animados siguen animados?', answer: 'No. Las páginas PDF son estáticas, por lo que los WebP animados se convierten usando un fotograma fijo.' },
        { question: '¿Se eliminan los WebP tras convertir?', answer: 'Sí. Las imágenes se procesan temporalmente y se eliminan automáticamente en 30 minutos.' },
      ],
      limitations: 'PDF es un formato de documento estático, así que no conserva animaciones. Las imágenes WebP muy pequeñas pueden verse pixeladas si se estiran a una página grande.',
    },
  },

  'ocr-pdf': {
    en: {
      intro:
        'Run OCR on scanned PDF files so their text becomes searchable and selectable. FlowToPDF reads the page images, recognises printed text and creates a PDF that is easier to search, copy and organise while keeping the original page appearance.',
      useCases: [
        { title: 'Make scanned contracts searchable', description: 'Add a text layer so you can find names, clauses and dates with search.' },
        { title: 'Digitise receipts and paperwork', description: 'Convert paper scans into PDFs that are easier to file and retrieve later.' },
        { title: 'Prepare documents for review', description: 'Make scanned pages selectable before sending them to colleagues or legal teams.' },
        { title: 'Improve document accessibility', description: 'A searchable text layer helps PDF readers and indexing tools understand the content.' },
      ],
      faqs: [
        { question: 'What does OCR mean?', answer: 'OCR stands for Optical Character Recognition. It detects text inside scanned images and adds machine-readable text to the PDF.' },
        { question: 'Which languages are supported?', answer: 'The OCR tool supports English, Spanish, French, German, Portuguese and Italian.' },
        { question: 'Will OCR change how my PDF looks?', answer: 'The visual pages stay the same. OCR adds a text layer so the PDF becomes searchable and selectable.' },
        { question: 'How accurate is OCR?', answer: 'Accuracy depends on scan quality, contrast, page rotation and font clarity. Clean printed text works best.' },
        { question: 'Can OCR read handwriting?', answer: 'Handwriting recognition is unreliable. This tool is designed primarily for printed or typed text.' },
      ],
      limitations: 'OCR quality depends on the source scan. Blurry pages, low contrast, handwriting and complex layouts may produce incomplete or incorrect text.',
    },
    es: {
      intro:
        'Aplica OCR a archivos PDF escaneados para que su texto sea buscable y seleccionable. FlowToPDF lee las imágenes de las páginas, reconoce texto impreso y crea un PDF más fácil de buscar, copiar y organizar manteniendo la apariencia original.',
      useCases: [
        { title: 'Hacer buscables contratos escaneados', description: 'Añade una capa de texto para encontrar nombres, cláusulas y fechas con el buscador.' },
        { title: 'Digitalizar recibos y documentos', description: 'Convierte escaneos en PDFs más fáciles de archivar y recuperar después.' },
        { title: 'Preparar documentos para revisión', description: 'Haz seleccionables las páginas escaneadas antes de enviarlas a compañeros o equipos legales.' },
        { title: 'Mejorar la accesibilidad', description: 'Una capa de texto ayuda a lectores PDF y herramientas de indexación a entender el contenido.' },
      ],
      faqs: [
        { question: '¿Qué significa OCR?', answer: 'OCR significa Reconocimiento Óptico de Caracteres. Detecta texto dentro de imágenes escaneadas y añade texto legible por máquina al PDF.' },
        { question: '¿Qué idiomas admite?', answer: 'La herramienta OCR admite inglés, español, francés, alemán, portugués e italiano.' },
        { question: '¿El OCR cambia el aspecto del PDF?', answer: 'Las páginas visuales se mantienen igual. El OCR añade una capa de texto para que el PDF sea buscable y seleccionable.' },
        { question: '¿Qué precisión tiene el OCR?', answer: 'Depende de la calidad del escaneo, contraste, rotación y claridad de la fuente. El texto impreso limpio funciona mejor.' },
        { question: '¿Puede leer escritura a mano?', answer: 'El reconocimiento de escritura a mano no es fiable. Esta herramienta está pensada principalmente para texto impreso o mecanografiado.' },
      ],
      limitations: 'La calidad del OCR depende del escaneo original. Páginas borrosas, bajo contraste, escritura a mano y diseños complejos pueden producir texto incompleto o incorrecto.',
    },
  },
};

/**
 * Look up SEO content for a tool by ID. Returns undefined if not found.
 */
export function getToolSeoContent(toolId: string, lang: 'en' | 'es'): ToolSeoSection | undefined {
  const content = toolSeoContent[toolId];
  if (!content) return undefined;
  return content[lang];
}
