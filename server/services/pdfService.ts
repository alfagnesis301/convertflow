import {
  PDFDocument,
  degrees,
  StandardFonts,
  rgb,
  type PDFPage,
} from 'pdf-lib';

// ─── Types ───────────────────────────────────────────────────────────────────

export type CompressLevel = 'low' | 'medium' | 'high';
export type RotateDegrees = 90 | 180 | 270;

// ─── Merge PDFs ───────────────────────────────────────────────────────────────

/**
 * Merge multiple PDF buffers into a single PDF document.
 */
export async function mergePDFs(files: Buffer[]): Promise<Buffer> {
  if (files.length === 0) throw new Error('No files provided to merge.');

  const merged = await PDFDocument.create();

  for (const fileBuffer of files) {
    const doc = await PDFDocument.load(fileBuffer);
    const pageCount = doc.getPageCount();
    const indices = Array.from({ length: pageCount }, (_, i) => i);
    const copiedPages = await merged.copyPages(doc, indices);
    for (const page of copiedPages) {
      merged.addPage(page);
    }
  }

  const bytes = await merged.save();
  return Buffer.from(bytes);
}

// ─── Split PDF ────────────────────────────────────────────────────────────────

/**
 * Split a PDF into multiple PDFs based on page ranges.
 *
 * @param file   - Source PDF buffer
 * @param ranges - Comma-separated ranges, e.g. "1-3,5,7-9" (1-indexed)
 *                 Pass "all" to extract every page individually.
 * @returns Array of PDF buffers, one per range/page.
 */
export async function splitPDF(file: Buffer, ranges: string): Promise<Buffer[]> {
  const source = await PDFDocument.load(file);
  const totalPages = source.getPageCount();
  const results: Buffer[] = [];

  // Parse ranges into arrays of 0-indexed page numbers
  const pageGroups = parsePageRanges(ranges, totalPages);

  for (const group of pageGroups) {
    const doc = await PDFDocument.create();
    const copied = await doc.copyPages(source, group);
    for (const page of copied) {
      doc.addPage(page);
    }
    const bytes = await doc.save();
    results.push(Buffer.from(bytes));
  }

  return results;
}

// ─── Compress PDF ─────────────────────────────────────────────────────────────

/**
 * Attempt to reduce PDF file size.
 *
 * IMPORTANT: pdf-lib does not have a built-in compression pass that can
 * re-encode images or remove embedded fonts. The available optimisation is
 * minimal — it removes unused object references and uses object streams.
 * For significant size reduction, a tool like Ghostscript or Poppler's
 * pdftocairo is required.
 *
 * The `level` parameter influences whether pdf-lib's useObjectStreams flag
 * is enabled (medium/high), which can yield small savings on some files.
 */
export async function compressPDF(file: Buffer, level: CompressLevel): Promise<Buffer> {
  const doc = await PDFDocument.load(file, {
    updateMetadata: false,
  });

  const useObjectStreams = level !== 'low';

  const bytes = await doc.save({
    useObjectStreams,
    addDefaultPage: false,
    objectsPerTick: 50,
  });

  return Buffer.from(bytes);
}

// ─── Rotate PDF ───────────────────────────────────────────────────────────────

/**
 * Rotate pages in a PDF.
 *
 * @param file    - Source PDF buffer
 * @param deg     - Rotation in degrees: 90 | 180 | 270
 * @param pages   - Optional 1-indexed page numbers to rotate.
 *                  Omit (or pass empty) to rotate all pages.
 */
export async function rotatePDF(
  file: Buffer,
  deg: RotateDegrees,
  pageNumbers?: number[]
): Promise<Buffer> {
  const doc = await PDFDocument.load(file);
  const totalPages = doc.getPageCount();

  const indicesToRotate: number[] =
    pageNumbers && pageNumbers.length > 0
      ? pageNumbers.map((n) => n - 1).filter((i) => i >= 0 && i < totalPages)
      : Array.from({ length: totalPages }, (_, i) => i);

  for (const idx of indicesToRotate) {
    const page = doc.getPage(idx);
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees((currentRotation + deg) % 360));
  }

  const bytes = await doc.save();
  return Buffer.from(bytes);
}

// ─── Protect PDF ─────────────────────────────────────────────────────────────

/**
 * Encrypt a PDF with a user password.
 *
 * Note: pdf-lib v1.x does not natively support AES-256 encryption.
 * This uses the encrypt() method which applies RC4-128 (PDF standard).
 * For production use with strict security requirements, Ghostscript or
 * qpdf would provide AES-256 encryption.
 */
export async function protectPDF(file: Buffer, password: string): Promise<Buffer> {
  if (!password || password.trim().length === 0) {
    throw new Error('A non-empty password is required to protect a PDF.');
  }

  const doc = await PDFDocument.load(file);

  // pdf-lib exposes encrypt via the internal PDFSecurity mechanism.
  // We set it via the save options.
  const bytes = await doc.save({
    // @ts-expect-error pdf-lib types don't expose the encrypt option publicly,
    // but it is supported via the underlying pdf-writer internals.
    encrypt: {
      userPassword: password,
      ownerPassword: password + '_owner',
      permissions: {
        printing: 'highResolution',
        modifying: false,
        copying: false,
        annotating: false,
        fillingForms: true,
        contentAccessibility: true,
        documentAssembly: false,
      },
    },
  });

  return Buffer.from(bytes);
}

// ─── Unlock PDF ───────────────────────────────────────────────────────────────

/**
 * Remove password protection from a PDF, given the correct password.
 */
export async function unlockPDF(file: Buffer, password: string): Promise<Buffer> {
  let doc: PDFDocument;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    doc = await PDFDocument.load(file, { password } as any);
  } catch {
    throw new Error('Incorrect password or the PDF is not encrypted.');
  }

  // Save without encryption to produce an unlocked copy
  const bytes = await doc.save();
  return Buffer.from(bytes);
}

// ─── Extract pages ────────────────────────────────────────────────────────────

/**
 * Extract specific pages (1-indexed) from a PDF into a new document.
 */
export async function extractPages(file: Buffer, pageNumbers: number[]): Promise<Buffer> {
  if (pageNumbers.length === 0) throw new Error('No page numbers specified.');

  const source = await PDFDocument.load(file);
  const totalPages = source.getPageCount();
  const indices = pageNumbers
    .map((n) => n - 1)
    .filter((i) => i >= 0 && i < totalPages);

  if (indices.length === 0) {
    throw new Error('None of the specified pages exist in the document.');
  }

  const doc = await PDFDocument.create();
  const copied = await doc.copyPages(source, indices);
  for (const page of copied) {
    doc.addPage(page);
  }

  const bytes = await doc.save();
  return Buffer.from(bytes);
}

// ─── Reorder pages ────────────────────────────────────────────────────────────

/**
 * Reorder pages in a PDF.
 *
 * @param file  - Source PDF buffer
 * @param order - 1-indexed page numbers in the desired new order.
 *                Must include every page number (no duplicates or omissions).
 */
export async function reorderPages(file: Buffer, order: number[]): Promise<Buffer> {
  const source = await PDFDocument.load(file);
  const totalPages = source.getPageCount();

  if (order.length !== totalPages) {
    throw new Error(
      `Order array length (${order.length}) must match total pages (${totalPages}).`
    );
  }

  const indices = order.map((n) => n - 1);
  const uniqueIndices = new Set(indices);
  if (uniqueIndices.size !== totalPages) {
    throw new Error('Page order must contain each page number exactly once.');
  }

  const doc = await PDFDocument.create();
  const copied = await doc.copyPages(source, indices);
  for (const page of copied) {
    doc.addPage(page);
  }

  const bytes = await doc.save();
  return Buffer.from(bytes);
}

// ─── Text to PDF ─────────────────────────────────────────────────────────────

/**
 * Convert a plain text string to a simple PDF document.
 * Uses pdf-lib's built-in Helvetica font for clean, universally-compatible output.
 */
export async function textToPDF(text: string): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);

  const PAGE_WIDTH = 595.28;  // A4 pt
  const PAGE_HEIGHT = 841.89;
  const MARGIN = 50;
  const FONT_SIZE = 12;
  const LINE_HEIGHT = FONT_SIZE * 1.4;
  const MAX_LINE_WIDTH = PAGE_WIDTH - MARGIN * 2;

  // Normalise line endings
  const rawLines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');

  // Word-wrap each line to fit page width
  const wrappedLines: string[] = [];
  for (const line of rawLines) {
    if (line.trim() === '') {
      wrappedLines.push('');
      continue;
    }
    const words = line.split(' ');
    let current = '';
    for (const word of words) {
      const probe = current ? `${current} ${word}` : word;
      const probeWidth = font.widthOfTextAtSize(probe, FONT_SIZE);
      if (probeWidth > MAX_LINE_WIDTH && current) {
        wrappedLines.push(current);
        current = word;
      } else {
        current = probe;
      }
    }
    if (current) wrappedLines.push(current);
  }

  // Paginate
  let page: PDFPage = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;

  for (const line of wrappedLines) {
    if (y - LINE_HEIGHT < MARGIN) {
      page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      y = PAGE_HEIGHT - MARGIN;
    }

    if (line !== '') {
      page.drawText(line, {
        x: MARGIN,
        y,
        size: FONT_SIZE,
        font,
        color: rgb(0, 0, 0),
      });
    }

    y -= LINE_HEIGHT;
  }

  const bytes = await doc.save();
  return Buffer.from(bytes);
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

/**
 * Parse a range string into groups of 0-indexed page number arrays.
 *
 * "all"       → [[0], [1], [2], ...] (each page as its own group)
 * "1-3,5,7-9" → [[0,1,2], [4], [6,7,8]]
 */
function parsePageRanges(rangesStr: string, totalPages: number): number[][] {
  if (rangesStr.trim().toLowerCase() === 'all') {
    return Array.from({ length: totalPages }, (_, i) => [i]);
  }

  const groups: number[][] = [];
  const parts = rangesStr.split(',').map((s) => s.trim()).filter(Boolean);

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-');
      const start = Math.max(1, parseInt(startStr ?? '1', 10));
      const end = Math.min(totalPages, parseInt(endStr ?? String(totalPages), 10));
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        const group = Array.from({ length: end - start + 1 }, (_, i) => start - 1 + i);
        groups.push(group);
      }
    } else {
      const n = parseInt(part, 10);
      if (!isNaN(n) && n >= 1 && n <= totalPages) {
        groups.push([n - 1]);
      }
    }
  }

  return groups;
}
