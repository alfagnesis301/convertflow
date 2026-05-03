import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { textToPDF } from './pdfService';

// ─── LibreOffice availability check ──────────────────────────────────────────

let libreOfficeAvailable: boolean | null = null;

async function checkLibreOffice(): Promise<boolean> {
  if (libreOfficeAvailable !== null) return libreOfficeAvailable;

  const { execFile } = await import('child_process');
  const { promisify } = await import('util');
  const execFileAsync = promisify(execFile);

  try {
    await execFileAsync('which', ['libreoffice']);
    libreOfficeAvailable = true;
  } catch {
    try {
      // Windows fallback
      await execFileAsync('where', ['soffice']);
      libreOfficeAvailable = true;
    } catch {
      libreOfficeAvailable = false;
    }
  }
  return libreOfficeAvailable;
}

// ─── LibreOffice conversion ───────────────────────────────────────────────────

/**
 * Convert an office document (docx, xlsx, pptx, odt, rtf, etc.) to PDF
 * using LibreOffice in headless mode.
 *
 * Requires LibreOffice to be installed and available in the system PATH
 * as `libreoffice` (Linux/macOS) or `soffice` (Windows).
 */
export async function convertWithLibreOffice(
  inputPath: string,
  outputDir: string
): Promise<string> {
  const available = await checkLibreOffice();
  if (!available) {
    throw new Error(
      'LibreOffice is not installed on this server. ' +
      'DOCX, XLSX, PPTX, ODT, and RTF conversions require LibreOffice. ' +
      'Install it from https://www.libreoffice.org/download/libreoffice/'
    );
  }

  const { execFile } = await import('child_process');
  const { promisify } = await import('util');
  const path = await import('path');
  const fs = await import('fs');
  const execFileAsync = promisify(execFile);

  const cmd = process.platform === 'win32' ? 'soffice' : 'libreoffice';

  await execFileAsync(cmd, [
    '--headless',
    '--convert-to', 'pdf',
    '--outdir', outputDir,
    inputPath,
  ], {
    timeout: 60_000,
    env: {
      ...process.env,
      HOME: outputDir, // prevent profile lock conflicts
    },
  });

  // LibreOffice names the output file based on the input basename
  const inputBasename = path.basename(inputPath, path.extname(inputPath));
  const expectedOutput = path.join(outputDir, `${inputBasename}.pdf`);

  if (!fs.existsSync(expectedOutput)) {
    throw new Error('LibreOffice conversion did not produce an output file.');
  }

  return expectedOutput;
}

// ─── Markdown to PDF ──────────────────────────────────────────────────────────

/**
 * Convert Markdown text to a PDF document.
 *
 * Strategy: parse Markdown into a simple structured representation and
 * render it using pdf-lib. This handles headings, paragraphs, code blocks,
 * bullet lists, and horizontal rules without requiring a browser or headless
 * Chrome.
 *
 * For full fidelity (CSS, images, complex layouts), a headless browser
 * such as Puppeteer would be needed.
 */
export async function markdownToPDF(markdown: string): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold    = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontMono    = await doc.embedFont(StandardFonts.Courier);

  const PAGE_W = 595.28;
  const PAGE_H = 841.89;
  const MARGIN = 50;
  const TEXT_W = PAGE_W - MARGIN * 2;

  interface DrawState {
    page: ReturnType<typeof doc.addPage>;
    y: number;
  }

  function newPage(): DrawState {
    const page = doc.addPage([PAGE_W, PAGE_H]);
    return { page, y: PAGE_H - MARGIN };
  }

  function ensureSpace(state: DrawState, needed: number): DrawState {
    if (state.y - needed < MARGIN) {
      return newPage();
    }
    return state;
  }

  function drawText(
    state: DrawState,
    text: string,
    opts: { size: number; font: typeof fontRegular; color?: ReturnType<typeof rgb>; indent?: number }
  ): DrawState {
    const { size, font, color = rgb(0, 0, 0), indent = 0 } = opts;
    const lineH = size * 1.4;
    const maxW = TEXT_W - indent;

    // Word wrap
    const words = text.split(' ');
    let line = '';
    const lines: string[] = [];

    for (const word of words) {
      const probe = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(probe, size) > maxW && line) {
        lines.push(line);
        line = word;
      } else {
        line = probe;
      }
    }
    if (line) lines.push(line);

    for (const l of lines) {
      state = ensureSpace(state, lineH);
      state.y -= lineH;
      state.page.drawText(l, {
        x: MARGIN + indent,
        y: state.y,
        size,
        font,
        color,
      });
    }

    return state;
  }

  let state = newPage();
  const lines = markdown.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? '';

    if (line.startsWith('# ')) {
      state = ensureSpace(state, 30);
      state.y -= 10;
      state = drawText(state, line.slice(2), { size: 22, font: fontBold });
      state.y -= 6;
    } else if (line.startsWith('## ')) {
      state = ensureSpace(state, 26);
      state.y -= 8;
      state = drawText(state, line.slice(3), { size: 18, font: fontBold });
      state.y -= 4;
    } else if (line.startsWith('### ')) {
      state = ensureSpace(state, 22);
      state.y -= 6;
      state = drawText(state, line.slice(4), { size: 15, font: fontBold });
      state.y -= 4;
    } else if (line.startsWith('---') || line.startsWith('***') || line.startsWith('___')) {
      // Horizontal rule
      state = ensureSpace(state, 16);
      state.y -= 8;
      state.page.drawLine({
        start: { x: MARGIN, y: state.y },
        end:   { x: PAGE_W - MARGIN, y: state.y },
        thickness: 0.5,
        color: rgb(0.7, 0.7, 0.7),
      });
      state.y -= 8;
    } else if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('+ ')) {
      const content = line.slice(2);
      state = ensureSpace(state, 16);
      // Bullet point
      state.y -= 2;
      state.page.drawText('•', { x: MARGIN + 4, y: state.y, size: 12, font: fontRegular });
      state = drawText(state, content, { size: 12, font: fontRegular, indent: 18 });
      state.y += 12 * 1.4; // drawText already moved y; correct for bullet
    } else if (line.startsWith('```')) {
      // Code block: collect until closing ```
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i]?.startsWith('```')) {
        codeLines.push(lines[i] ?? '');
        i++;
      }
      for (const codeLine of codeLines) {
        state = ensureSpace(state, 14);
        state = drawText(state, codeLine || ' ', {
          size: 10,
          font: fontMono,
          color: rgb(0.1, 0.1, 0.4),
          indent: 10,
        });
      }
      state.y -= 4;
    } else if (line.trim() === '') {
      state.y -= 12; // Paragraph break
    } else {
      // Remove basic inline markdown: **bold**, *italic*, `code`
      const cleaned = line
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/`(.+?)`/g, '$1')
        .replace(/\[(.+?)\]\(.+?\)/g, '$1');

      state = drawText(state, cleaned, { size: 12, font: fontRegular });
    }
  }

  const bytes = await doc.save();
  return Buffer.from(bytes);
}

// ─── HTML to PDF ──────────────────────────────────────────────────────────────

/**
 * Convert HTML to a PDF.
 *
 * This is a basic implementation that strips HTML tags and renders the
 * resulting plain text as a PDF using pdf-lib.
 *
 * For full CSS/layout fidelity, Puppeteer (headless Chrome) would be required.
 * Since Puppeteer is not included in this project, we provide this lightweight
 * fallback and document the limitation.
 */
export async function htmlToPDF(html: string): Promise<Buffer> {
  // Strip HTML tags and decode common entities
  const text = html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return textToPDF(text);
}

// ─── CSV to PDF ───────────────────────────────────────────────────────────────

/**
 * Convert CSV data to a PDF table.
 *
 * Parses CSV (handles quoted fields), then renders a basic table
 * using pdf-lib with alternating row shading for readability.
 */
export async function csvToPDF(csv: string): Promise<Buffer> {
  const rows = parseCSV(csv);
  if (rows.length === 0) throw new Error('CSV file is empty.');

  const doc = await PDFDocument.create();
  const font     = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const PAGE_W = 841.89; // A4 Landscape
  const PAGE_H = 595.28;
  const MARGIN  = 30;
  const FONT_SIZE = 9;
  const ROW_H    = FONT_SIZE * 2;
  const COL_PAD  = 5;

  const numCols = Math.max(...rows.map((r) => r.length));
  const colWidth = (PAGE_W - MARGIN * 2) / numCols;

  let page = doc.addPage([PAGE_W, PAGE_H]);
  let y = PAGE_H - MARGIN;

  for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
    const row = rows[rowIdx] ?? [];
    const isHeader = rowIdx === 0;

    if (y - ROW_H < MARGIN) {
      page = doc.addPage([PAGE_W, PAGE_H]);
      y = PAGE_H - MARGIN;
    }

    // Row background
    if (isHeader) {
      page.drawRectangle({
        x: MARGIN, y: y - ROW_H,
        width: PAGE_W - MARGIN * 2, height: ROW_H,
        color: rgb(0.23, 0.51, 0.96),
      });
    } else if (rowIdx % 2 === 0) {
      page.drawRectangle({
        x: MARGIN, y: y - ROW_H,
        width: PAGE_W - MARGIN * 2, height: ROW_H,
        color: rgb(0.95, 0.95, 0.98),
      });
    }

    for (let colIdx = 0; colIdx < numCols; colIdx++) {
      const cell  = (row[colIdx] ?? '').slice(0, 50); // truncate long cells
      const cellX = MARGIN + colIdx * colWidth + COL_PAD;
      const cellY = y - ROW_H + (ROW_H - FONT_SIZE) / 2;

      page.drawText(cell, {
        x: cellX,
        y: cellY,
        size: FONT_SIZE,
        font: isHeader ? fontBold : font,
        color: isHeader ? rgb(1, 1, 1) : rgb(0.1, 0.1, 0.1),
        maxWidth: colWidth - COL_PAD * 2,
      });
    }

    // Row bottom border
    page.drawLine({
      start: { x: MARGIN, y: y - ROW_H },
      end:   { x: PAGE_W - MARGIN, y: y - ROW_H },
      thickness: 0.3,
      color: rgb(0.8, 0.8, 0.8),
    });

    y -= ROW_H;
  }

  const bytes = await doc.save();
  return Buffer.from(bytes);
}

// ─── Extract text from PDF ────────────────────────────────────────────────────

/**
 * Extract all text content from a PDF buffer using pdf-lib.
 *
 * Note: pdf-lib can read text content objects from PDF pages, but the
 * quality of extraction depends heavily on how the PDF was created.
 * Scanned PDFs with no text layer will yield an empty string.
 * For those, use the OCR endpoint instead.
 */
export async function extractTextFromPDF(pdfBuffer: Buffer): Promise<string> {
  const doc = await PDFDocument.load(pdfBuffer);
  const textParts: string[] = [];

  for (let i = 0; i < doc.getPageCount(); i++) {
    const page = doc.getPage(i);
    // pdf-lib does not provide a high-level getTextContent() method.
    // We access the raw content stream and extract text-showing operators.
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const contentStream = (page as any).node.Contents();
      if (contentStream) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decoded = (contentStream as any).getContentsString?.() ?? '';
        // Extract text between parentheses in Tj / TJ operators
        const matches = decoded.matchAll(/\(([^)]*)\)\s*(?:Tj|'|")/g);
        for (const match of matches) {
          if (match[1]) textParts.push(match[1]);
        }
      }
    } catch {
      // If extraction fails for a page, continue to the next
    }
  }

  // Clean up escape sequences common in PDF content streams
  return textParts
    .join(' ')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\\\/g, '\\')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
    .trim();
}

// ─── CSV parser ───────────────────────────────────────────────────────────────

/**
 * Minimal RFC 4180-compliant CSV parser.
 * Handles quoted fields containing commas and newlines.
 */
function parseCSV(csv: string): string[][] {
  const rows: string[][] = [];
  const lines = csv.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  let i = 0;
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  while (i < lines.length) {
    const ch = lines[i];

    if (inQuotes) {
      if (ch === '"') {
        if (lines[i + 1] === '"') {
          // Escaped quote ""
          field += '"';
          i += 2;
        } else {
          inQuotes = false;
          i++;
        }
      } else {
        field += ch;
        i++;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
        i++;
      } else if (ch === ',') {
        row.push(field.trim());
        field = '';
        i++;
      } else if (ch === '\n') {
        row.push(field.trim());
        field = '';
        if (row.some((c) => c !== '')) rows.push(row);
        row = [];
        i++;
      } else {
        field += ch;
        i++;
      }
    }
  }

  // Last field / row
  if (field || row.length > 0) {
    row.push(field.trim());
    if (row.some((c) => c !== '')) rows.push(row);
  }

  return rows;
}
