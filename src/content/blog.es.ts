import type { BlogPost } from './blog.en';

export const blogPostsEs: BlogPost[] = [
  {
    slug: 'como-convertir-pdf-a-word',
    title: 'Cómo convertir PDF a Word sin perder el formato',
    excerpt:
      'Convertir un PDF a un documento Word editable puede ser complicado. Aprende los mejores métodos y herramientas para preservar el diseño y las fuentes.',
    date: '2025-04-10',
    author: 'Equipo FlowToPDF',
    category: 'Guías',
    relatedTools: ['pdf-to-word'],
    content: `
## Por qué la conversión de PDF a Word es un desafío

Los archivos PDF están diseñados para una presentación de diseño fijo, no para edición. Cuando conviertes un PDF a Word, el conversor debe reconstruir la estructura del documento: detectar texto, fuentes, columnas, tablas e imágenes.

## Mejores prácticas para conversiones limpias

1. **Usa PDFs basados en texto, no imágenes escaneadas** — Si tu PDF fue creado desde un documento de Word u Office, contiene texto real que se puede extraer fielmente. Los PDFs escaneados requieren OCR.
2. **Evita diseños complejos con múltiples columnas** — Los artículos académicos con dos columnas suelen perder su estructura al convertirse.
3. **Revisa las fuentes después de la conversión** — Algunas fuentes pueden sustituirse. Revisa el documento en Word y corrige cualquier problema de fuente.

## Cómo lo hace FlowToPDF

FlowToPDF usa LibreOffice en el servidor para realizar la conversión. LibreOffice es una suite ofimática de código abierto con sólidas capacidades de importación de PDF. La conversión tarda unos segundos para un documento estándar.

## Problemas comunes y soluciones

- **Las imágenes aparecen desplazadas**: Reposiciónalas manualmente en Word tras la conversión.
- **Las tablas se convierten en texto plano**: Las tablas complejas pueden perder sus bordes. Vuelve a aplicar el formato de tabla en Word.
- **Las fuentes difieren**: Instala las fuentes correspondientes o aplica un estilo de documento.

## Conclusión

Para la mayoría de los PDFs estándar, un conversor gratuito en línea como FlowToPDF producirá un documento Word limpio y editable.
    `,
  },
  {
    slug: 'como-comprimir-pdf',
    title: 'Cómo comprimir un PDF sin perder calidad',
    excerpt:
      'Los PDFs grandes ralentizan los adjuntos de correo electrónico y las subidas. Aquí te explicamos cómo reducir el tamaño del archivo PDF manteniéndolo legible.',
    date: '2025-04-15',
    author: 'Equipo FlowToPDF',
    category: 'Consejos',
    relatedTools: ['compress-pdf'],
    content: `
## Por qué los archivos PDF se vuelven grandes

Los PDFs crecen en tamaño por las imágenes incrustadas, fuentes, metadatos y, a veces, datos redundantes de múltiples guardados. Una sola imagen de alta resolución puede añadir fácilmente varios megabytes.

## Niveles de compresión explicados

FlowToPDF ofrece tres niveles de compresión:

- **Bajo**: Reduce el tamaño del archivo ligeramente. Ideal para documentos donde la calidad es crítica, como contratos o documentos legales.
- **Medio**: Un equilibrio recomendado para la mayoría de usos. Reduce el tamaño del archivo un 30-60%.
- **Alto**: Compresión máxima. La calidad de las imágenes se reducirá notablemente. Ideal para archivos compartidos por chat o correo.

## Consejos para la máxima compresión

- Elimina las páginas innecesarias antes de comprimir.
- Si el PDF contiene imágenes grandes, comprime esas imágenes antes de crear el PDF.
- Evita incrustar fuentes que no necesites.

## Cuándo no comprimir

No comprimas en exceso PDFs que se vayan a imprimir en alta resolución, como folletos o portafolios fotográficos.
    `,
  },
  {
    slug: 'unir-pdfs-guia',
    title: 'Cómo unir varios PDFs en un solo documento',
    excerpt:
      'Combinar varios archivos PDF en uno es sencillo cuando conoces las herramientas adecuadas. Sigue esta guía paso a paso para unir PDFs gratis online.',
    date: '2025-04-22',
    author: 'Equipo FlowToPDF',
    category: 'Guías',
    relatedTools: ['merge-pdf'],
    content: `
## ¿Cuándo necesitas unir PDFs?

Algunos casos comunes para unir PDFs incluyen:

- Combinar facturas y recibos en un solo archivo para la contabilidad
- Ensamblar un documento de varios capítulos a partir de archivos separados
- Enviar varias páginas escaneadas como un único adjunto
- Unir informes de diferentes departamentos en una sola presentación

## Pasos para unir PDFs con FlowToPDF

1. Ve a la herramienta **Unir PDF**.
2. Sube hasta 20 archivos PDF arrastrando y soltando o haciendo clic en "Elegir archivo".
3. Los archivos aparecerán en el orden en que se subieron. Reordénalos si es necesario.
4. Haz clic en **Unir**. Tu PDF combinado estará listo en segundos.
5. Descarga el archivo unido.

## Consejos para mejores resultados

- Si deseas un orden específico, renombra tus archivos numéricamente antes de subirlos (1.pdf, 2.pdf, etc.).
- Comprueba el tamaño total del archivo. Si el PDF fusionado es demasiado grande, usa la herramienta **Comprimir PDF** después.
- Todos los archivos se eliminan de nuestros servidores en 30 minutos.
    `,
  },
  {
    slug: 'jpg-a-pdf-mejores-practicas',
    title: 'JPG a PDF: Mejores prácticas para resultados de alta calidad',
    excerpt:
      'Al convertir imágenes a PDF, los pequeños detalles como el tamaño de página y los márgenes importan. Aquí te explicamos cómo obtener el mejor resultado de tus archivos JPG.',
    date: '2025-05-01',
    author: 'Equipo FlowToPDF',
    category: 'Consejos',
    relatedTools: ['jpg-to-pdf'],
    content: `
## Elegir el tamaño de página correcto

Al convertir un JPG a PDF, puedes elegir entre A4, Carta, Legal o ajuste automático. Si creas un documento para imprimir, usa **A4** (Europa/internacional) o **Carta** (EE.UU.). Para uso solo digital, **Auto (ajustar imagen)** funciona mejor.

## Orientación

Para fotos horizontales, selecciona la orientación **Horizontal**. Para imágenes verticales o documentos escaneados, usa **Vertical** (predeterminado).

## Márgenes

Los márgenes afectan el espacio en blanco alrededor de tu imagen:

- **Ninguno**: La imagen llena toda la página. Ideal para presentaciones.
- **Pequeño**: Un ligero borde. Recomendado para la mayoría de documentos.
- **Medio**: Márgenes visibles que dan un aspecto profesional para informes impresos.

## Varias imágenes en un PDF

Puedes subir hasta 20 imágenes JPG a la vez. Se colocarán en páginas separadas en el orden en que las subas.

## Consideraciones de calidad

FlowToPDF usa la resolución original de tu imagen. Para mejor calidad de impresión, usa imágenes de al menos 150 DPI.
    `,
  },
  {
    slug: 'proteccion-contrasena-pdf',
    title: 'Cómo proteger un PDF con contraseña y por qué deberías hacerlo',
    excerpt:
      'Proteger con contraseña los PDFs sensibles es una medida de seguridad rápida. Aprende cuándo y cómo proteger tus PDFs correctamente.',
    date: '2025-05-10',
    author: 'Equipo FlowToPDF',
    category: 'Seguridad',
    relatedTools: ['protect-pdf', 'unlock-pdf'],
    content: `
## ¿Por qué proteger un PDF?

Los PDFs que contienen información sensible — como declaraciones de impuestos, contratos, identificación personal o registros médicos — deben protegerse con contraseña antes de enviarlos por correo electrónico o subirlos a almacenamiento en la nube.

## Lo que hace (y no hace) la protección con contraseña

La protección con contraseña cifra el contenido del archivo. Sin la contraseña, el PDF no se puede abrir. Sin embargo:

- La protección con contraseña **no** impide que alguien tome una captura de pantalla si tiene la contraseña.
- **No** impide copiar texto si solo aplicas una contraseña de "apertura" sin restricciones de copia.

Usa contraseñas fuertes (más de 12 caracteres, mayúsculas y minúsculas, números, símbolos) y transmite la contraseña por un canal separado.

## Eliminar una contraseña

Si conoces la contraseña, puedes eliminarla usando la herramienta **Desbloquear PDF**.

## Nota importante

FlowToPDF no almacena tus contraseñas. Si olvidas la contraseña de un PDF protegido, no se puede recuperar.
    `,
  },
  {
    slug: 'que-es-ocr-y-cuando-usarlo',
    title: '¿Qué es el OCR y cuándo deberías usarlo en un PDF?',
    excerpt:
      'El OCR (Reconocimiento Óptico de Caracteres) transforma imágenes escaneadas en texto buscable. Aquí te explicamos cuándo y por qué lo necesitas.',
    date: '2025-05-18',
    author: 'Equipo FlowToPDF',
    category: 'Guías',
    relatedTools: ['ocr-pdf'],
    content: `
## ¿Qué es el OCR?

El Reconocimiento Óptico de Caracteres (OCR) es una tecnología que lee texto de imágenes y documentos escaneados y lo convierte en texto legible por máquinas.

Sin OCR, un PDF escaneado es solo una imagen: no puedes seleccionar texto, buscar palabras clave ni copiar contenido.

## Cuándo usar el OCR

- Escaneaste un documento físico (recibo, contrato, página de libro)
- Recibiste un PDF guardado desde un escáner
- No puedes seleccionar ni copiar texto en un visor de PDF

## Soporte de idiomas para OCR

La herramienta OCR de FlowToPDF admite: inglés, español, francés, alemán, portugués e italiano. Seleccionar el idioma correcto para tu documento mejora significativamente la precisión.

## Expectativas de precisión

La precisión del OCR depende de:
- **Calidad del escaneo** — Los escaneos de mayor resolución producen mejor reconocimiento de texto
- **Claridad de la fuente** — Las fuentes estándar se reconocen con más precisión que la escritura a mano
- **Complejidad del diseño** — El texto simple de una sola columna se convierte mejor

## Después del OCR

Una vez aplicado el OCR, el PDF se convierte en buscable. Puedes abrirlo en cualquier visor de PDF y usar Ctrl+F para buscar palabras específicas.
    `,
  },
];

export default blogPostsEs;
