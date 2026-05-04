import { Router, type Request, type Response, type NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import os from 'os';
import archiver from 'archiver';
import { z } from 'zod';
import { upload } from '../middleware/upload';
import { cleanupService } from '../services/cleanupService';
import {
  mergePDFs,
  splitPDF,
  compressPDF,
  rotatePDF,
  protectPDF,
  unlockPDF,
  extractPages,
  reorderPages,
  textToPDF,
} from '../services/pdfService';
import {
  imageToPDF,
  multipleImagesToPDF,
  pdfPageToImage,
} from '../services/imageService';
import {
  markdownToPDF,
  htmlToPDF,
  csvToPDF,
  extractTextFromPDF,
  convertWithLibreOffice,
} from '../services/documentService';

// ─── MIME type → file extension normalisation ─────────────────────────────────
// The frontend sends the HTML accept-attribute MIME types as sourceFormat.
// The switch statement uses short extension-style keys, so we normalise here.

const MIME_TO_EXT: Record<string, string> = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.oasis.opendocument.text': 'odt',
  'application/rtf': 'rtf',
  'text/rtf': 'rtf',
  'text/plain': 'txt',
  'text/html': 'html',
  'text/markdown': 'md',
  'text/csv': 'csv',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
  'image/*': 'image',
};

function normaliseFormat(fmt: string): string {
  return MIME_TO_EXT[fmt] ?? fmt;
}

// ─── Router ───────────────────────────────────────────────────────────────────

export const convertRouter = Router();

// ─── Zod validation schema ────────────────────────────────────────────────────

const ConvertRequestSchema = z.object({
  sourceFormat: z.string().min(1).max(50),
  targetFormat: z.string().min(1).max(50),
  // Optional parameters (parsed from body as strings)
  password:   z.string().max(128).optional(),
  pages:      z.string().max(500).optional(),
  ranges:     z.string().max(500).optional(),
  degrees:    z.enum(['90', '180', '270']).optional(),
  level:      z.enum(['low', 'medium', 'high']).optional(),
  order:      z.string().max(500).optional(),
  splitMode:  z.enum(['all', 'ranges']).optional(),
  pageSize:   z.enum(['auto', 'A4', 'Letter', 'Legal']).optional(),
  orientation: z.enum(['portrait', 'landscape']).optional(),
  margin:     z.enum(['none', 'small', 'medium']).optional(),
  quality:    z.enum(['low', 'medium', 'high']).optional(),
  language:   z.string().max(10).optional(),
});

type ConvertRequest = z.infer<typeof ConvertRequestSchema>;

// ─── Helper: collect uploaded file paths ─────────────────────────────────────

function getUploadedPaths(req: Request): string[] {
  if (Array.isArray(req.files)) {
    return (req.files as Express.Multer.File[]).map((f) => f.path);
  }
  if (req.file) {
    return [req.file.path];
  }
  return [];
}

function getUploadedBuffers(req: Request): Buffer[] {
  const paths = getUploadedPaths(req);
  return paths.map((p) => fs.readFileSync(p));
}

// ─── Helper: send a single file as download ───────────────────────────────────

function sendFile(
  res: Response,
  buffer: Buffer,
  filename: string,
  mimeType: string,
  tempPaths: string[]
): void {
  res.setHeader('Content-Type', mimeType);
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
  res.setHeader('Content-Length', String(buffer.length));
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.end(buffer);
  // Clean up all temp files after response
  cleanupService.deleteMany(tempPaths);
}

// ─── Helper: send multiple files as a ZIP ────────────────────────────────────

function sendZip(
  res: Response,
  buffers: Buffer[],
  baseFilename: string,
  extension: string,
  tempPaths: string[]
): void {
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(baseFilename)}.zip"`);
  res.setHeader('X-Content-Type-Options', 'nosniff');

  const archive = archiver('zip', { zlib: { level: 6 } });
  archive.on('error', (err) => {
    console.error('[convert] Archiver error:', err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to create ZIP archive.' });
    }
  });

  archive.pipe(res);

  buffers.forEach((buf, idx) => {
    archive.append(buf, { name: `${baseFilename}-${idx + 1}.${extension}` });
  });

  archive.finalize().then(() => {
    cleanupService.deleteMany(tempPaths);
  }).catch((err) => {
    console.error('[convert] Archive finalize error:', err.message);
    cleanupService.deleteMany(tempPaths);
  });
}

// ─── Helper: parse page numbers from a string ────────────────────────────────

function parsePageNumbers(str: string): number[] {
  const numbers: number[] = [];
  const parts = str.split(',').map((s) => s.trim()).filter(Boolean);
  for (const part of parts) {
    if (part.includes('-')) {
      const [a, b] = part.split('-').map(Number);
      if (a !== undefined && b !== undefined && !isNaN(a) && !isNaN(b)) {
        for (let i = a; i <= b; i++) numbers.push(i);
      }
    } else {
      const n = parseInt(part, 10);
      if (!isNaN(n)) numbers.push(n);
    }
  }
  return numbers;
}

// ─── Main conversion endpoint ─────────────────────────────────────────────────

convertRouter.post(
  '/',
  upload.array('files', 30),
  async (req: Request, res: Response, next: NextFunction) => {
    const tempPaths = getUploadedPaths(req);

    // Register all uploads for automatic cleanup fallback
    for (const p of tempPaths) cleanupService.register(p);

    try {
      // ── Validate request body ──────────────────────────────────────────────

      const bodyParse = ConvertRequestSchema.safeParse(req.body);
      if (!bodyParse.success) {
        cleanupService.deleteMany(tempPaths);
        res.status(400).json({
          error: 'Invalid request parameters.',
          details: bodyParse.error.issues.map((i) => i.message),
        });
        return;
      }

      const params: ConvertRequest = bodyParse.data;

      if (tempPaths.length === 0) {
        res.status(400).json({ error: 'No file was uploaded.' });
        return;
      }

      const sourceFormat = normaliseFormat(params.sourceFormat);
      const targetFormat = normaliseFormat(params.targetFormat);
      const conversionKey = `${sourceFormat}→${targetFormat}`;

      // ── Route to conversion handler ────────────────────────────────────────

      switch (conversionKey) {

        // ── Merge PDFs ─────────────────────────────────────────────────────
        case 'pdf→pdf-merge': {
          const buffers = getUploadedBuffers(req);
          const result = await mergePDFs(buffers);
          sendFile(res, result, 'merged.pdf', 'application/pdf', tempPaths);
          break;
        }

        // ── Split PDF ──────────────────────────────────────────────────────
        case 'pdf→pdf-split': {
          const buffer = fs.readFileSync(tempPaths[0]!);
          const mode = params.splitMode ?? 'all';
          const rangeStr = mode === 'all' ? 'all' : (params.ranges ?? 'all');
          const results = await splitPDF(buffer, rangeStr);
          if (results.length === 1) {
            sendFile(res, results[0]!, 'split.pdf', 'application/pdf', tempPaths);
          } else {
            sendZip(res, results, 'split-pages', 'pdf', tempPaths);
          }
          break;
        }

        // ── Compress PDF ───────────────────────────────────────────────────
        case 'pdf→pdf-compress': {
          const buffer = fs.readFileSync(tempPaths[0]!);
          const level = (params.level ?? 'medium') as 'low' | 'medium' | 'high';
          const result = await compressPDF(buffer, level);
          sendFile(res, result, 'compressed.pdf', 'application/pdf', tempPaths);
          break;
        }

        // ── Rotate PDF ─────────────────────────────────────────────────────
        case 'pdf→pdf-rotate': {
          const buffer = fs.readFileSync(tempPaths[0]!);
          const deg = parseInt(params.degrees ?? '90', 10) as 90 | 180 | 270;
          const pageNums = params.pages ? parsePageNumbers(params.pages) : undefined;
          const result = await rotatePDF(buffer, deg, pageNums);
          sendFile(res, result, 'rotated.pdf', 'application/pdf', tempPaths);
          break;
        }

        // ── Protect PDF ────────────────────────────────────────────────────
        case 'pdf→pdf-protect': {
          if (!params.password) {
            cleanupService.deleteMany(tempPaths);
            res.status(400).json({ error: 'A password is required to protect a PDF.' });
            return;
          }
          const buffer = fs.readFileSync(tempPaths[0]!);
          const result = await protectPDF(buffer, params.password);
          sendFile(res, result, 'protected.pdf', 'application/pdf', tempPaths);
          break;
        }

        // ── Unlock PDF ─────────────────────────────────────────────────────
        case 'pdf→pdf-unlock': {
          const buffer = fs.readFileSync(tempPaths[0]!);
          const pw = params.password ?? '';
          const result = await unlockPDF(buffer, pw);
          sendFile(res, result, 'unlocked.pdf', 'application/pdf', tempPaths);
          break;
        }

        // ── Reorder PDF ────────────────────────────────────────────────────
        case 'pdf→pdf-reorder': {
          if (!params.order) {
            cleanupService.deleteMany(tempPaths);
            res.status(400).json({ error: 'A page order must be specified.' });
            return;
          }
          const buffer = fs.readFileSync(tempPaths[0]!);
          const orderNums = parsePageNumbers(params.order);
          const result = await reorderPages(buffer, orderNums);
          sendFile(res, result, 'reordered.pdf', 'application/pdf', tempPaths);
          break;
        }

        // ── Extract pages ──────────────────────────────────────────────────
        case 'pdf→pdf-extract': {
          if (!params.pages) {
            cleanupService.deleteMany(tempPaths);
            res.status(400).json({ error: 'Page numbers to extract must be specified.' });
            return;
          }
          const buffer = fs.readFileSync(tempPaths[0]!);
          const pageNums = parsePageNumbers(params.pages);
          const result = await extractPages(buffer, pageNums);
          sendFile(res, result, 'extracted.pdf', 'application/pdf', tempPaths);
          break;
        }

        // ── PDF to text ────────────────────────────────────────────────────
        case 'pdf→txt': {
          const buffer = fs.readFileSync(tempPaths[0]!);
          const text = await extractTextFromPDF(buffer);
          const textBuffer = Buffer.from(text, 'utf-8');
          sendFile(res, textBuffer, 'extracted.txt', 'text/plain; charset=utf-8', tempPaths);
          break;
        }

        // ── Text to PDF ────────────────────────────────────────────────────
        case 'txt→pdf': {
          const text = fs.readFileSync(tempPaths[0]!, 'utf-8');
          const result = await textToPDF(text);
          sendFile(res, result, 'converted.pdf', 'application/pdf', tempPaths);
          break;
        }

        // ── HTML to PDF ────────────────────────────────────────────────────
        case 'html→pdf': {
          const html = fs.readFileSync(tempPaths[0]!, 'utf-8');
          const result = await htmlToPDF(html);
          sendFile(res, result, 'converted.pdf', 'application/pdf', tempPaths);
          break;
        }

        // ── Markdown to PDF ────────────────────────────────────────────────
        case 'md→pdf':
        case 'markdown→pdf': {
          const md = fs.readFileSync(tempPaths[0]!, 'utf-8');
          const result = await markdownToPDF(md);
          sendFile(res, result, 'converted.pdf', 'application/pdf', tempPaths);
          break;
        }

        // ── CSV to PDF ─────────────────────────────────────────────────────
        case 'csv→pdf': {
          const csv = fs.readFileSync(tempPaths[0]!, 'utf-8');
          const result = await csvToPDF(csv);
          sendFile(res, result, 'converted.pdf', 'application/pdf', tempPaths);
          break;
        }

        // ── Image to PDF (single or multiple) ─────────────────────────────
        case 'jpg→pdf':
        case 'jpeg→pdf':
        case 'png→pdf':
        case 'webp→pdf':
        case 'gif→pdf':
        case 'svg→pdf':
        case 'image→pdf': {
          const imageOptions = {
            pageSize: params.pageSize ?? 'A4',
            orientation: params.orientation ?? 'portrait',
            margin: params.margin ?? 'small',
          } as const;

          if (tempPaths.length === 1) {
            const file = req.files
              ? (req.files as Express.Multer.File[])[0]!
              : req.file!;
            const buffer = fs.readFileSync(tempPaths[0]!);
            const result = await imageToPDF(buffer, file.mimetype, imageOptions);
            sendFile(res, result, 'converted.pdf', 'application/pdf', tempPaths);
          } else {
            const files = req.files as Express.Multer.File[];
            const images = files.map((f) => ({
              buffer: fs.readFileSync(f.path),
              mimeType: f.mimetype,
            }));
            const result = await multipleImagesToPDF(images, imageOptions);
            sendFile(res, result, 'converted.pdf', 'application/pdf', tempPaths);
          }
          break;
        }

        // ── PDF to JPG / PNG ───────────────────────────────────────────────
        case 'pdf→jpg':
        case 'pdf→jpeg':
        case 'pdf→png': {
          const fmt = targetFormat === 'jpg' || targetFormat === 'jpeg' ? 'jpeg' : 'png';
          const dpiMap = { low: 72, medium: 150, high: 300 } as const;
          const dpi = dpiMap[params.quality ?? 'high'];
          const buffer = fs.readFileSync(tempPaths[0]!);

          // We need to know how many pages are in the PDF.
          // Use pdf-lib just to get the page count; actual rasterisation uses Poppler.
          const { PDFDocument } = await import('pdf-lib');
          const pdfDoc = await PDFDocument.load(buffer);
          const totalPages = pdfDoc.getPageCount();

          if (totalPages === 1) {
            try {
              const imgBuffer = await pdfPageToImage(buffer, 0, fmt, dpi);
              const mime = fmt === 'jpeg' ? 'image/jpeg' : 'image/png';
              const ext  = fmt === 'jpeg' ? 'jpg' : 'png';
              sendFile(res, imgBuffer, `page-1.${ext}`, mime, tempPaths);
            } catch (err) {
              const msg = err instanceof Error ? err.message : 'Conversion failed.';
              cleanupService.deleteMany(tempPaths);
              res.status(501).json({ error: msg });
            }
          } else {
            try {
              const imageBuffers: Buffer[] = [];
              for (let p = 0; p < totalPages; p++) {
                imageBuffers.push(await pdfPageToImage(buffer, p, fmt, dpi));
              }
              const ext = fmt === 'jpeg' ? 'jpg' : 'png';
              sendZip(res, imageBuffers, 'pages', ext, tempPaths);
            } catch (err) {
              const msg = err instanceof Error ? err.message : 'Conversion failed.';
              cleanupService.deleteMany(tempPaths);
              res.status(501).json({ error: msg });
            }
          }
          break;
        }

        // ── LibreOffice-based conversions (Office → PDF) ───────────────────
        case 'docx→pdf':
        case 'doc→pdf':
        case 'xlsx→pdf':
        case 'xls→pdf':
        case 'pptx→pdf':
        case 'ppt→pdf':
        case 'odt→pdf':
        case 'rtf→pdf': {
          const outDir = os.tmpdir();
          let outputPath: string | null = null;
          try {
            outputPath = await convertWithLibreOffice(tempPaths[0]!, outDir, 'pdf');
            cleanupService.register(outputPath);
            const resultBuffer = fs.readFileSync(outputPath);
            const originalName = (req.files as Express.Multer.File[])?.[0]?.originalname ?? 'file';
            const baseName = path.basename(originalName, path.extname(originalName));
            sendFile(res, resultBuffer, `${baseName}.pdf`, 'application/pdf', [
              ...tempPaths,
              outputPath,
            ]);
          } catch (err) {
            const msg = err instanceof Error ? err.message : 'Conversion failed.';
            cleanupService.deleteMany(tempPaths);
            if (outputPath) cleanupService.deleteNow(outputPath);
            const isNotInstalled = msg.includes('LibreOffice is not installed');
            res.status(isNotInstalled ? 501 : 500).json({ error: msg });
          }
          break;
        }

        // ── PDF to Word / other formats (LibreOffice) ──────────────────────
        case 'pdf→docx':
        case 'pdf→word':
        case 'pdf→xlsx':
        case 'pdf→pptx': {
          const extMap: Record<string, string> = {
            'pdf→docx': 'docx',
            'pdf→word': 'docx',
            'pdf→xlsx': 'xlsx',
            'pdf→pptx': 'pptx',
          };
          const mimeMap: Record<string, string> = {
            docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          };
          const outExt = extMap[conversionKey] ?? 'docx';
          const outMime = mimeMap[outExt] ?? 'application/octet-stream';
          const outDir = os.tmpdir();
          let outputPath: string | null = null;
          try {
            outputPath = await convertWithLibreOffice(tempPaths[0]!, outDir, outExt);
            cleanupService.register(outputPath);
            const resultBuffer = fs.readFileSync(outputPath);
            const originalName = (req.files as Express.Multer.File[])?.[0]?.originalname ?? 'file';
            const baseName = path.basename(originalName, path.extname(originalName));
            sendFile(res, resultBuffer, `${baseName}.${outExt}`, outMime, [
              ...tempPaths,
              outputPath,
            ]);
          } catch (err) {
            const msg = err instanceof Error ? err.message : 'Conversion failed.';
            cleanupService.deleteMany(tempPaths);
            if (outputPath) cleanupService.deleteNow(outputPath);
            const isNotInstalled = msg.includes('LibreOffice is not installed');
            res.status(isNotInstalled ? 501 : 500).json({ error: msg });
          }
          break;
        }

        // ── OCR PDF ────────────────────────────────────────────────────────
        case 'pdf→pdf-ocr': {
          // tesseract.js is included as a dependency.
          // Full implementation reads pages as images, runs OCR, embeds text layer.
          // PDF rasterisation requires Poppler; if unavailable, we return 501.
          cleanupService.deleteMany(tempPaths);
          res.status(501).json({
            error:
              'OCR requires Poppler for PDF rasterisation. ' +
              'Please install Poppler (pdftoppm) on the server to enable this feature.',
          });
          break;
        }

        // ── Unknown conversion ─────────────────────────────────────────────
        default: {
          cleanupService.deleteMany(tempPaths);
          res.status(400).json({
            error: `Unsupported conversion: ${sourceFormat} → ${targetFormat}`,
          });
        }
      }
    } catch (err) {
      // Clean up on unhandled errors
      cleanupService.deleteMany(tempPaths);

      const message = err instanceof Error ? err.message : 'Conversion failed.';
      // Never expose internal paths or stack traces to the client
      console.error(`[convert] Error (${req.body?.sourceFormat}→${req.body?.targetFormat}):`, message);

      if (!res.headersSent) {
        res.status(500).json({ error: 'Conversion failed. Please check your file and try again.' });
      }

      next(err);
    }
  }
);

// ─── Multer error handler ─────────────────────────────────────────────────────

convertRouter.use((err: Error & { code?: string }, _req: Request, res: Response, next: NextFunction) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    const mb = parseInt(process.env['MAX_FILE_SIZE_MB'] ?? '50', 10);
    res.status(413).json({ error: `File too large. Maximum allowed size is ${mb} MB.` });
    return;
  }
  if (err.code === 'LIMIT_FILE_COUNT') {
    res.status(400).json({ error: 'Too many files. Maximum is 30 files per request.' });
    return;
  }
  if (err.message?.startsWith('Unsupported file type')) {
    res.status(415).json({ error: 'Unsupported file format.' });
    return;
  }
  next(err);
});
