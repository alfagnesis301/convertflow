// ─── Types ───────────────────────────────────────────────────────────────────

export type ToolCategory =
  | 'pdf-converter'
  | 'image-to-pdf'
  | 'pdf-tools'
  | 'office-to-pdf';

export interface ToolOption {
  id: string;
  label: string;
  type: 'select' | 'text' | 'number' | 'checkbox';
  default: string | number | boolean;
  options?: { value: string; label: string }[];
}

export interface Tool {
  id: string;
  slug: { en: string; es: string };
  category: ToolCategory;
  sourceFormats: string[];
  targetFormat: string;
  icon: string; // lucide-react icon name (PascalCase)
  maxFiles: number;
  acceptMultiple: boolean;
  options?: ToolOption[];
  available: boolean; // false → shows "coming soon" badge
  requiresLibreOffice?: boolean;
  requiresPoppler?: boolean;
}

// ─── Shared option presets ───────────────────────────────────────────────────

const PAGE_SIZE_OPTION: ToolOption = {
  id: 'pageSize',
  label: 'Page Size',
  type: 'select',
  default: 'A4',
  options: [
    { value: 'auto', label: 'Auto (fit image)' },
    { value: 'A4', label: 'A4' },
    { value: 'Letter', label: 'Letter' },
    { value: 'Legal', label: 'Legal' },
  ],
};

const ORIENTATION_OPTION: ToolOption = {
  id: 'orientation',
  label: 'Orientation',
  type: 'select',
  default: 'portrait',
  options: [
    { value: 'portrait', label: 'Portrait' },
    { value: 'landscape', label: 'Landscape' },
  ],
};

const MARGIN_OPTION: ToolOption = {
  id: 'margin',
  label: 'Margin',
  type: 'select',
  default: 'small',
  options: [
    { value: 'none', label: 'None' },
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
  ],
};

const COMPRESS_LEVEL_OPTION: ToolOption = {
  id: 'level',
  label: 'Compression Level',
  type: 'select',
  default: 'medium',
  options: [
    { value: 'low', label: 'Low (better quality)' },
    { value: 'medium', label: 'Medium (balanced)' },
    { value: 'high', label: 'High (smaller file)' },
  ],
};

const ROTATE_DEGREES_OPTION: ToolOption = {
  id: 'degrees',
  label: 'Rotation',
  type: 'select',
  default: '90',
  options: [
    { value: '90', label: '90° clockwise' },
    { value: '180', label: '180°' },
    { value: '270', label: '270° clockwise' },
  ],
};

const IMAGE_QUALITY_OPTION: ToolOption = {
  id: 'quality',
  label: 'Image Quality',
  type: 'select',
  default: 'high',
  options: [
    { value: 'low', label: 'Low (72 dpi)' },
    { value: 'medium', label: 'Medium (150 dpi)' },
    { value: 'high', label: 'High (300 dpi)' },
  ],
};

// ─── Tool definitions ────────────────────────────────────────────────────────

export const tools: Tool[] = [
  // PDF Converter tools
  {
    id: 'pdf-to-word',
    slug: { en: 'pdf-to-word', es: 'pdf-a-word' },
    category: 'pdf-converter',
    sourceFormats: ['application/pdf'],
    targetFormat: 'docx',
    icon: 'FileText',
    maxFiles: 1,
    acceptMultiple: false,
    available: true,
    requiresLibreOffice: true,
  },
  {
    id: 'word-to-pdf',
    slug: { en: 'word-to-pdf', es: 'word-a-pdf' },
    category: 'office-to-pdf',
    sourceFormats: [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ],
    targetFormat: 'pdf',
    icon: 'FileText',
    maxFiles: 1,
    acceptMultiple: false,
    available: true,
    requiresLibreOffice: true,
  },
  {
    id: 'docx-to-pdf',
    slug: { en: 'docx-to-pdf', es: 'docx-a-pdf' },
    category: 'office-to-pdf',
    sourceFormats: [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    targetFormat: 'pdf',
    icon: 'FileText',
    maxFiles: 1,
    acceptMultiple: false,
    available: true,
    requiresLibreOffice: true,
  },
  {
    id: 'excel-to-pdf',
    slug: { en: 'excel-to-pdf', es: 'excel-a-pdf' },
    category: 'office-to-pdf',
    sourceFormats: [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ],
    targetFormat: 'pdf',
    icon: 'Table',
    maxFiles: 1,
    acceptMultiple: false,
    available: true,
    requiresLibreOffice: true,
  },
  {
    id: 'powerpoint-to-pdf',
    slug: { en: 'powerpoint-to-pdf', es: 'powerpoint-a-pdf' },
    category: 'office-to-pdf',
    sourceFormats: [
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-powerpoint',
    ],
    targetFormat: 'pdf',
    icon: 'Presentation',
    maxFiles: 1,
    acceptMultiple: false,
    available: true,
    requiresLibreOffice: true,
  },
  {
    id: 'odt-to-pdf',
    slug: { en: 'odt-to-pdf', es: 'odt-a-pdf' },
    category: 'office-to-pdf',
    sourceFormats: ['application/vnd.oasis.opendocument.text'],
    targetFormat: 'pdf',
    icon: 'FileText',
    maxFiles: 1,
    acceptMultiple: false,
    available: true,
    requiresLibreOffice: true,
  },
  {
    id: 'rtf-to-pdf',
    slug: { en: 'rtf-to-pdf', es: 'rtf-a-pdf' },
    category: 'office-to-pdf',
    sourceFormats: ['application/rtf', 'text/rtf'],
    targetFormat: 'pdf',
    icon: 'FileText',
    maxFiles: 1,
    acceptMultiple: false,
    available: true,
    requiresLibreOffice: true,
  },

  // Image to PDF
  {
    id: 'jpg-to-pdf',
    slug: { en: 'jpg-to-pdf', es: 'jpg-a-pdf' },
    category: 'image-to-pdf',
    sourceFormats: ['image/jpeg'],
    targetFormat: 'pdf',
    icon: 'Image',
    maxFiles: 20,
    acceptMultiple: true,
    options: [PAGE_SIZE_OPTION, ORIENTATION_OPTION, MARGIN_OPTION],
    available: true,
  },
  {
    id: 'png-to-pdf',
    slug: { en: 'png-to-pdf', es: 'png-a-pdf' },
    category: 'image-to-pdf',
    sourceFormats: ['image/png'],
    targetFormat: 'pdf',
    icon: 'Image',
    maxFiles: 20,
    acceptMultiple: true,
    options: [PAGE_SIZE_OPTION, ORIENTATION_OPTION, MARGIN_OPTION],
    available: true,
  },
  {
    id: 'webp-to-pdf',
    slug: { en: 'webp-to-pdf', es: 'webp-a-pdf' },
    category: 'image-to-pdf',
    sourceFormats: ['image/webp'],
    targetFormat: 'pdf',
    icon: 'Image',
    maxFiles: 20,
    acceptMultiple: true,
    options: [PAGE_SIZE_OPTION, ORIENTATION_OPTION, MARGIN_OPTION],
    available: true,
  },
  {
    id: 'gif-to-pdf',
    slug: { en: 'gif-to-pdf', es: 'gif-a-pdf' },
    category: 'image-to-pdf',
    sourceFormats: ['image/gif'],
    targetFormat: 'pdf',
    icon: 'Image',
    maxFiles: 1,
    acceptMultiple: false,
    options: [PAGE_SIZE_OPTION, ORIENTATION_OPTION, MARGIN_OPTION],
    available: true,
  },
  {
    id: 'svg-to-pdf',
    slug: { en: 'svg-to-pdf', es: 'svg-a-pdf' },
    category: 'image-to-pdf',
    sourceFormats: ['image/svg+xml'],
    targetFormat: 'pdf',
    icon: 'Pen',
    maxFiles: 1,
    acceptMultiple: false,
    options: [PAGE_SIZE_OPTION, ORIENTATION_OPTION, MARGIN_OPTION],
    available: true,
  },
  {
    id: 'image-to-pdf',
    slug: { en: 'image-to-pdf', es: 'imagen-a-pdf' },
    category: 'image-to-pdf',
    sourceFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    targetFormat: 'pdf',
    icon: 'Images',
    maxFiles: 30,
    acceptMultiple: true,
    options: [PAGE_SIZE_OPTION, ORIENTATION_OPTION, MARGIN_OPTION],
    available: true,
  },

  // PDF to other formats
  {
    id: 'pdf-to-jpg',
    slug: { en: 'pdf-to-jpg', es: 'pdf-a-jpg' },
    category: 'pdf-converter',
    sourceFormats: ['application/pdf'],
    targetFormat: 'jpg',
    icon: 'Image',
    maxFiles: 1,
    acceptMultiple: false,
    options: [IMAGE_QUALITY_OPTION],
    available: true,
    requiresPoppler: true,
  },
  {
    id: 'pdf-to-png',
    slug: { en: 'pdf-to-png', es: 'pdf-a-png' },
    category: 'pdf-converter',
    sourceFormats: ['application/pdf'],
    targetFormat: 'png',
    icon: 'Image',
    maxFiles: 1,
    acceptMultiple: false,
    options: [IMAGE_QUALITY_OPTION],
    available: true,
    requiresPoppler: true,
  },
  {
    id: 'pdf-to-text',
    slug: { en: 'pdf-to-text', es: 'pdf-a-texto' },
    category: 'pdf-converter',
    sourceFormats: ['application/pdf'],
    targetFormat: 'txt',
    icon: 'FileSearch',
    maxFiles: 1,
    acceptMultiple: false,
    available: true,
  },

  // Text / document to PDF
  {
    id: 'text-to-pdf',
    slug: { en: 'text-to-pdf', es: 'texto-a-pdf' },
    category: 'pdf-converter',
    sourceFormats: ['text/plain'],
    targetFormat: 'pdf',
    icon: 'FileType',
    maxFiles: 1,
    acceptMultiple: false,
    options: [PAGE_SIZE_OPTION, MARGIN_OPTION],
    available: true,
  },
  {
    id: 'txt-to-pdf',
    slug: { en: 'txt-to-pdf', es: 'txt-a-pdf' },
    category: 'pdf-converter',
    sourceFormats: ['text/plain'],
    targetFormat: 'pdf',
    icon: 'FileType',
    maxFiles: 1,
    acceptMultiple: false,
    options: [PAGE_SIZE_OPTION, MARGIN_OPTION],
    available: true,
  },
  {
    id: 'html-to-pdf',
    slug: { en: 'html-to-pdf', es: 'html-a-pdf' },
    category: 'pdf-converter',
    sourceFormats: ['text/html'],
    targetFormat: 'pdf',
    icon: 'Code',
    maxFiles: 1,
    acceptMultiple: false,
    options: [PAGE_SIZE_OPTION, MARGIN_OPTION],
    available: true,
  },
  {
    id: 'markdown-to-pdf',
    slug: { en: 'markdown-to-pdf', es: 'markdown-a-pdf' },
    category: 'pdf-converter',
    sourceFormats: ['text/markdown', 'text/plain'],
    targetFormat: 'pdf',
    icon: 'Hash',
    maxFiles: 1,
    acceptMultiple: false,
    options: [PAGE_SIZE_OPTION, MARGIN_OPTION],
    available: true,
  },
  {
    id: 'csv-to-pdf',
    slug: { en: 'csv-to-pdf', es: 'csv-a-pdf' },
    category: 'pdf-converter',
    sourceFormats: ['text/csv', 'text/plain'],
    targetFormat: 'pdf',
    icon: 'Sheet',
    maxFiles: 1,
    acceptMultiple: false,
    options: [PAGE_SIZE_OPTION, ORIENTATION_OPTION],
    available: true,
  },

  // PDF tools
  {
    id: 'merge-pdf',
    slug: { en: 'merge-pdf', es: 'unir-pdf' },
    category: 'pdf-tools',
    sourceFormats: ['application/pdf'],
    targetFormat: 'pdf',
    icon: 'GitMerge',
    maxFiles: 20,
    acceptMultiple: true,
    available: true,
  },
  {
    id: 'split-pdf',
    slug: { en: 'split-pdf', es: 'dividir-pdf' },
    category: 'pdf-tools',
    sourceFormats: ['application/pdf'],
    targetFormat: 'pdf',
    icon: 'Scissors',
    maxFiles: 1,
    acceptMultiple: false,
    options: [
      {
        id: 'splitMode',
        label: 'Split Mode',
        type: 'select',
        default: 'all',
        options: [
          { value: 'all', label: 'Extract every page' },
          { value: 'ranges', label: 'Custom page ranges (e.g. 1-3, 5, 7-9)' },
        ],
      },
      {
        id: 'ranges',
        label: 'Page Ranges',
        type: 'text',
        default: '',
      },
    ],
    available: true,
  },
  {
    id: 'compress-pdf',
    slug: { en: 'compress-pdf', es: 'comprimir-pdf' },
    category: 'pdf-tools',
    sourceFormats: ['application/pdf'],
    targetFormat: 'pdf',
    icon: 'PackageOpen',
    maxFiles: 1,
    acceptMultiple: false,
    options: [COMPRESS_LEVEL_OPTION],
    available: true,
  },
  {
    id: 'rotate-pdf',
    slug: { en: 'rotate-pdf', es: 'rotar-pdf' },
    category: 'pdf-tools',
    sourceFormats: ['application/pdf'],
    targetFormat: 'pdf',
    icon: 'RotateCw',
    maxFiles: 1,
    acceptMultiple: false,
    options: [
      ROTATE_DEGREES_OPTION,
      {
        id: 'pages',
        label: 'Pages to Rotate (leave blank for all)',
        type: 'text',
        default: '',
      },
    ],
    available: true,
  },
  {
    id: 'protect-pdf',
    slug: { en: 'protect-pdf', es: 'proteger-pdf' },
    category: 'pdf-tools',
    sourceFormats: ['application/pdf'],
    targetFormat: 'pdf',
    icon: 'Lock',
    maxFiles: 1,
    acceptMultiple: false,
    options: [
      {
        id: 'password',
        label: 'Password',
        type: 'text',
        default: '',
      },
    ],
    available: true,
  },
  {
    id: 'unlock-pdf',
    slug: { en: 'unlock-pdf', es: 'desbloquear-pdf' },
    category: 'pdf-tools',
    sourceFormats: ['application/pdf'],
    targetFormat: 'pdf',
    icon: 'Unlock',
    maxFiles: 1,
    acceptMultiple: false,
    options: [
      {
        id: 'password',
        label: 'Password',
        type: 'text',
        default: '',
      },
    ],
    available: true,
  },
  {
    id: 'reorder-pdf',
    slug: { en: 'reorder-pdf', es: 'reordenar-pdf' },
    category: 'pdf-tools',
    sourceFormats: ['application/pdf'],
    targetFormat: 'pdf',
    icon: 'ArrowUpDown',
    maxFiles: 1,
    acceptMultiple: false,
    options: [
      {
        id: 'order',
        label: 'New page order (comma-separated, e.g. 3,1,2)',
        type: 'text',
        default: '',
      },
    ],
    available: true,
  },
  {
    id: 'extract-pages',
    slug: { en: 'extract-pages', es: 'extraer-paginas' },
    category: 'pdf-tools',
    sourceFormats: ['application/pdf'],
    targetFormat: 'pdf',
    icon: 'FileMinus',
    maxFiles: 1,
    acceptMultiple: false,
    options: [
      {
        id: 'pages',
        label: 'Pages to extract (e.g. 1,3,5-8)',
        type: 'text',
        default: '',
      },
    ],
    available: true,
  },
  {
    id: 'ocr-pdf',
    slug: { en: 'ocr-pdf', es: 'ocr-pdf' },
    category: 'pdf-tools',
    sourceFormats: ['application/pdf'],
    targetFormat: 'pdf',
    icon: 'ScanText',
    maxFiles: 1,
    acceptMultiple: false,
    options: [
      {
        id: 'language',
        label: 'Document Language',
        type: 'select',
        default: 'eng',
        options: [
          { value: 'eng', label: 'English' },
          { value: 'spa', label: 'Spanish' },
          { value: 'fra', label: 'French' },
          { value: 'deu', label: 'German' },
          { value: 'por', label: 'Portuguese' },
          { value: 'ita', label: 'Italian' },
        ],
      },
    ],
    available: true,
  },
];

// ─── Lookup helpers ──────────────────────────────────────────────────────────

export function getToolById(id: string): Tool | undefined {
  return tools.find((t) => t.id === id);
}

export function getToolBySlug(slug: string, lang: 'en' | 'es' = 'en'): Tool | undefined {
  return tools.find((t) => t.slug[lang] === slug);
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return tools.filter((t) => t.category === category);
}

export const categories: { id: ToolCategory; labelKey: string; icon: string }[] = [
  { id: 'pdf-converter', labelKey: 'categories.pdfConverter', icon: 'ArrowLeftRight' },
  { id: 'image-to-pdf', labelKey: 'categories.imageToPdf', icon: 'Images' },
  { id: 'pdf-tools', labelKey: 'categories.pdfTools', icon: 'Wrench' },
  { id: 'office-to-pdf', labelKey: 'categories.officeToPdf', icon: 'Briefcase' },
];
