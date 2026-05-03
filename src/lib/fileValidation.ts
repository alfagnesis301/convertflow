import mime from 'mime-types';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const DEFAULT_MAX_SIZE_MB = 50;

export function getMaxFileSizeBytes(overrideMB?: number): number {
  const mb = overrideMB ?? DEFAULT_MAX_SIZE_MB;
  return mb * 1024 * 1024;
}

/**
 * Map of tool ID → accepted MIME types.
 * Used both client-side (for input[accept]) and server-side validation.
 */
export const ALLOWED_MIME_TYPES: Record<string, string[]> = {
  'pdf-to-word':        ['application/pdf'],
  'word-to-pdf':        [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
  ],
  'docx-to-pdf':        ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  'excel-to-pdf':       [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ],
  'powerpoint-to-pdf':  [
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-powerpoint',
  ],
  'odt-to-pdf':         ['application/vnd.oasis.opendocument.text'],
  'rtf-to-pdf':         ['application/rtf', 'text/rtf'],
  'jpg-to-pdf':         ['image/jpeg'],
  'png-to-pdf':         ['image/png'],
  'webp-to-pdf':        ['image/webp'],
  'gif-to-pdf':         ['image/gif'],
  'svg-to-pdf':         ['image/svg+xml'],
  'image-to-pdf':       ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  'pdf-to-jpg':         ['application/pdf'],
  'pdf-to-png':         ['application/pdf'],
  'pdf-to-text':        ['application/pdf'],
  'text-to-pdf':        ['text/plain'],
  'txt-to-pdf':         ['text/plain'],
  'html-to-pdf':        ['text/html', 'text/plain'],
  'markdown-to-pdf':    ['text/markdown', 'text/plain', 'text/x-markdown'],
  'csv-to-pdf':         ['text/csv', 'text/plain'],
  'merge-pdf':          ['application/pdf'],
  'split-pdf':          ['application/pdf'],
  'compress-pdf':       ['application/pdf'],
  'rotate-pdf':         ['application/pdf'],
  'protect-pdf':        ['application/pdf'],
  'unlock-pdf':         ['application/pdf'],
  'reorder-pdf':        ['application/pdf'],
  'extract-pages':      ['application/pdf'],
  'ocr-pdf':            ['application/pdf'],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Get the MIME type for a filename using mime-types.
 * Falls back to 'application/octet-stream' when unknown.
 */
export function getMimeType(filename: string): string {
  return mime.lookup(filename) || 'application/octet-stream';
}

/**
 * Sanitise a filename: strip path traversal characters, limit length,
 * and ensure the result is safe to use on the filesystem.
 */
export function sanitizeFilename(name: string): string {
  // Remove path separators and null bytes
  let safe = name.replace(/[/\\?%*:|"<>\x00-\x1f]/g, '-');
  // Collapse consecutive dashes
  safe = safe.replace(/-+/g, '-');
  // Trim leading/trailing dashes and dots
  safe = safe.replace(/^[.\-]+|[.\-]+$/g, '');
  // Limit length (keep extension)
  const maxLength = 200;
  if (safe.length > maxLength) {
    const dotIndex = safe.lastIndexOf('.');
    if (dotIndex > 0 && dotIndex > safe.length - 10) {
      const ext = safe.slice(dotIndex);
      safe = safe.slice(0, maxLength - ext.length) + ext;
    } else {
      safe = safe.slice(0, maxLength);
    }
  }
  return safe || 'file';
}

/**
 * Check whether a File object passes size and MIME-type validation.
 *
 * @param file         - The File (or file-like object with name, size, type)
 * @param allowedTypes - Array of accepted MIME type strings
 * @param maxSizeMB    - Maximum allowed size in megabytes
 */
export function validateFile(
  file: File,
  allowedTypes: string[],
  maxSizeMB: number = DEFAULT_MAX_SIZE_MB
): ValidationResult {
  const maxBytes = getMaxFileSizeBytes(maxSizeMB);

  if (file.size === 0) {
    return { valid: false, error: 'errors.emptyFile' };
  }

  if (file.size > maxBytes) {
    return { valid: false, error: 'errors.fileTooLarge' };
  }

  // Resolve MIME type: prefer file.type, fall back to filename lookup
  const fileMime = file.type || getMimeType(file.name);

  const mimeAllowed = allowedTypes.some((allowed) => {
    if (allowed.endsWith('/*')) {
      // Wildcard match, e.g. "image/*"
      return fileMime.startsWith(allowed.slice(0, -1));
    }
    return fileMime === allowed;
  });

  if (!mimeAllowed) {
    return { valid: false, error: 'errors.invalidFormat' };
  }

  return { valid: true };
}

/**
 * Validate multiple files at once.
 * Returns an array of ValidationResult in the same order as the input.
 */
export function validateFiles(
  files: File[],
  allowedTypes: string[],
  maxSizeMB: number = DEFAULT_MAX_SIZE_MB
): ValidationResult[] {
  return files.map((file) => validateFile(file, allowedTypes, maxSizeMB));
}

/**
 * Build a string suitable for an <input type="file" accept="..."> attribute
 * from a list of MIME types.
 */
export function buildAcceptString(mimeTypes: string[]): string {
  const extensions: string[] = [];
  for (const mimeType of mimeTypes) {
    const exts = mime.extensions[mimeType];
    if (exts) {
      extensions.push(...exts.map((e) => `.${e}`));
    }
  }
  return [...new Set([...mimeTypes, ...extensions])].join(',');
}
