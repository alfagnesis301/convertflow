import sharp from 'sharp';
import { PDFDocument } from 'pdf-lib';

// ─── Types ───────────────────────────────────────────────────────────────────

export type PageSize = 'auto' | 'A4' | 'Letter' | 'Legal';
export type Orientation = 'portrait' | 'landscape';
export type MarginSize = 'none' | 'small' | 'medium';
export type ImageFormat = 'jpeg' | 'png';

export interface ImageToPDFOptions {
  pageSize?: PageSize;
  orientation?: Orientation;
  margin?: MarginSize;
}

// ─── Constants ────────────────────────────────────────────────────────────────

// Points (72 pt = 1 inch)
const PAGE_SIZES_PT: Record<Exclude<PageSize, 'auto'>, [number, number]> = {
  A4:     [595.28, 841.89],
  Letter: [612, 792],
  Legal:  [612, 1008],
};

const MARGINS_PT: Record<MarginSize, number> = {
  none:   0,
  small:  20,
  medium: 50,
};

// ─── imageToPDF ───────────────────────────────────────────────────────────────

/**
 * Convert a single image buffer to a PDF document.
 *
 * @param imageBuffer - Raw image data
 * @param mimeType    - MIME type of the image (e.g. 'image/jpeg')
 * @param options     - Layout options
 */
export async function imageToPDF(
  imageBuffer: Buffer,
  mimeType: string,
  options: ImageToPDFOptions = {}
): Promise<Buffer> {
  // Normalise image to JPEG via sharp (handles WebP, GIF, etc.)
  const isPng  = mimeType === 'image/png';

  let processedBuffer: Buffer;
  let imgWidth: number;
  let imgHeight: number;

  if (mimeType === 'image/svg+xml') {
    // SVG needs rasterisation first
    const rasterised = await sharp(imageBuffer)
      .png()
      .toBuffer({ resolveWithObject: true });
    processedBuffer = rasterised.data;
    imgWidth  = rasterised.info.width;
    imgHeight = rasterised.info.height;
  } else {
    const meta = await sharp(imageBuffer).metadata();
    imgWidth  = meta.width  ?? 800;
    imgHeight = meta.height ?? 600;

    if (isPng) {
      processedBuffer = imageBuffer;
    } else {
      // Convert to JPEG for embedding (smaller PDF, wider compatibility)
      processedBuffer = await sharp(imageBuffer)
        .jpeg({ quality: 90 })
        .toBuffer();
    }
  }

  const doc = await PDFDocument.create();
  const margin = MARGINS_PT[options.margin ?? 'small'];

  let [pageW, pageH] = resolvePageSize(
    options.pageSize ?? 'A4',
    options.orientation ?? 'portrait',
    imgWidth,
    imgHeight
  );

  const page = doc.addPage([pageW, pageH]);

  // Available area after margins
  const availW = pageW - margin * 2;
  const availH = pageH - margin * 2;

  // Scale image to fit while preserving aspect ratio
  const scale = Math.min(availW / imgWidth, availH / imgHeight, 1);
  const drawW = imgWidth  * scale;
  const drawH = imgHeight * scale;

  // Center the image on the page
  const x = margin + (availW - drawW) / 2;
  const y = margin + (availH - drawH) / 2;

  let embeddedImage;
  if (isPng || mimeType === 'image/svg+xml') {
    embeddedImage = await doc.embedPng(processedBuffer);
  } else {
    embeddedImage = await doc.embedJpg(processedBuffer);
  }

  page.drawImage(embeddedImage, { x, y, width: drawW, height: drawH });

  const bytes = await doc.save();
  return Buffer.from(bytes);
}

// ─── multipleImagesToPDF ─────────────────────────────────────────────────────

/**
 * Combine multiple image buffers into a single PDF, one image per page.
 *
 * @param images  - Array of { buffer, mimeType } objects
 * @param options - Shared layout options applied to every page
 */
export async function multipleImagesToPDF(
  images: Array<{ buffer: Buffer; mimeType: string }>,
  options: ImageToPDFOptions = {}
): Promise<Buffer> {
  if (images.length === 0) throw new Error('No images provided.');

  const doc = await PDFDocument.create();
  const margin = MARGINS_PT[options.margin ?? 'small'];

  for (const { buffer, mimeType } of images) {
    let processedBuffer: Buffer;
    let imgWidth: number;
    let imgHeight: number;
    let isPng = mimeType === 'image/png';

    if (mimeType === 'image/svg+xml') {
      const rasterised = await sharp(buffer).png().toBuffer({ resolveWithObject: true });
      processedBuffer = rasterised.data;
      imgWidth  = rasterised.info.width;
      imgHeight = rasterised.info.height;
      isPng = true;
    } else {
      const meta = await sharp(buffer).metadata();
      imgWidth  = meta.width  ?? 800;
      imgHeight = meta.height ?? 600;

      if (mimeType === 'image/jpeg') {
        processedBuffer = buffer;
      } else {
        // WebP, GIF → JPEG
        processedBuffer = await sharp(buffer).jpeg({ quality: 90 }).toBuffer();
        isPng = false;
      }
    }

    const [pageW, pageH] = resolvePageSize(
      options.pageSize ?? 'A4',
      options.orientation ?? 'portrait',
      imgWidth,
      imgHeight
    );

    const page = doc.addPage([pageW, pageH]);
    const availW = pageW - margin * 2;
    const availH = pageH - margin * 2;

    const scale = Math.min(availW / imgWidth, availH / imgHeight, 1);
    const drawW = imgWidth  * scale;
    const drawH = imgHeight * scale;
    const x = margin + (availW - drawW) / 2;
    const y = margin + (availH - drawH) / 2;

    const embedded = isPng
      ? await doc.embedPng(processedBuffer)
      : await doc.embedJpg(processedBuffer);

    page.drawImage(embedded, { x, y, width: drawW, height: drawH });
  }

  const bytes = await doc.save();
  return Buffer.from(bytes);
}

// ─── pdfPageToImage ───────────────────────────────────────────────────────────

/**
 * Rasterise a single PDF page to an image.
 *
 * NOTE: pdf-lib is a pure JavaScript library for creating/editing PDFs and
 * does NOT include a PDF renderer (rasteriser). True PDF-to-image conversion
 * requires a native tool such as:
 *   - Poppler (pdftoppm / pdftocairo) — open-source, Linux/macOS
 *   - Ghostscript (gs) — cross-platform
 *   - LibreOffice Draw
 *
 * This function checks whether `pdftoppm` (Poppler) is available and uses it.
 * If Poppler is not installed, it throws a descriptive error so the API can
 * return a useful 501 response to the client.
 *
 * @param pdfBuffer - Source PDF buffer
 * @param pageIndex - 0-indexed page number
 * @param format    - Output image format
 * @param dpi       - Render resolution (72, 150, 300)
 */
export async function pdfPageToImage(
  pdfBuffer: Buffer,
  pageIndex: number,
  format: ImageFormat,
  dpi: number = 150
): Promise<Buffer> {
  const { hasPdftoppm } = await checkPopplerAvailable();

  if (!hasPdftoppm) {
    throw new Error(
      'PDF to image conversion requires Poppler (pdftoppm) to be installed on the server. ' +
      'Please install Poppler and ensure pdftoppm is in the system PATH.'
    );
  }

  const { execFile } = await import('child_process');
  const { promisify } = await import('util');
  const execFileAsync = promisify(execFile);
  const os = await import('os');
  const fs = await import('fs');
  const path = await import('path');
  const { v4: uuidv4 } = await import('uuid');

  const tmpDir = os.tmpdir();
  const inputPath = path.join(tmpDir, `cf-${uuidv4()}.pdf`);
  const outputPrefix = path.join(tmpDir, `cf-${uuidv4()}`);

  try {
    fs.writeFileSync(inputPath, pdfBuffer);

    const pageNum = pageIndex + 1; // pdftoppm uses 1-based page numbers
    const formatFlag = format === 'jpeg' ? '-jpeg' : '-png';

    await execFileAsync('pdftoppm', [
      formatFlag,
      '-r', String(dpi),
      '-f', String(pageNum),
      '-l', String(pageNum),
      '-singlefile',
      inputPath,
      outputPrefix,
    ]);

    // pdftoppm appends the format extension
    const ext = format === 'jpeg' ? '.jpg' : '.png';
    const outputPath = `${outputPrefix}${ext}`;

    if (!fs.existsSync(outputPath)) {
      throw new Error('pdftoppm did not produce an output file.');
    }

    const result = fs.readFileSync(outputPath);
    fs.unlinkSync(outputPath);
    return result;
  } finally {
    try { fs.unlinkSync(inputPath); } catch { /* ignore */ }
  }
}

// ─── svgToPNG ─────────────────────────────────────────────────────────────────

/**
 * Rasterise an SVG buffer to a PNG image using sharp.
 *
 * @param svgBuffer - Raw SVG data
 * @param width     - Output width in pixels (height is proportional)
 */
export async function svgToPNG(svgBuffer: Buffer, width?: number): Promise<Buffer> {
  let pipeline = sharp(svgBuffer);
  if (width) {
    pipeline = pipeline.resize(width);
  }
  return pipeline.png({ compressionLevel: 9 }).toBuffer();
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function resolvePageSize(
  pageSize: PageSize,
  orientation: Orientation,
  imgWidth: number,
  imgHeight: number
): [number, number] {
  if (pageSize === 'auto') {
    // Use image dimensions directly (converted to points at 96 DPI)
    const w = (imgWidth  / 96) * 72;
    const h = (imgHeight / 96) * 72;
    return [w, h];
  }

  let [w, h] = PAGE_SIZES_PT[pageSize];
  if (orientation === 'landscape') {
    [w, h] = [h, w];
  }
  return [w, h];
}

async function checkPopplerAvailable(): Promise<{ hasPdftoppm: boolean }> {
  try {
    const { execFile } = await import('child_process');
    const { promisify } = await import('util');
    const execFileAsync = promisify(execFile);
    await execFileAsync('pdftoppm', ['-v']);
    return { hasPdftoppm: true };
  } catch {
    return { hasPdftoppm: false };
  }
}
