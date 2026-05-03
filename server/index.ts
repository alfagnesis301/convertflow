import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import rateLimit from 'express-rate-limit';
import { convertRouter } from './routes/convert';
import { contactRouter } from './routes/contact';
import { cleanupService } from './services/cleanupService';

// ─── Config ───────────────────────────────────────────────────────────────────

const PORT = parseInt(process.env['PORT'] ?? '3001', 10);
const MAX_FILE_SIZE_MB = parseInt(process.env['MAX_FILE_SIZE_MB'] ?? '50', 10);

// ─── App ─────────────────────────────────────────────────────────────────────

const app = express();

// ─── Security middleware ──────────────────────────────────────────────────────

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false, // handled by Vite/CDN in production
  })
);

app.use(
  cors({
    origin:
      process.env['NODE_ENV'] === 'production'
        ? [process.env['SITE_URL'] ?? 'https://convertflow.app']
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Accept'],
  })
);

// ─── Rate limiting ────────────────────────────────────────────────────────────

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});

const convertLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Conversion rate limit reached. Please wait before trying again.' },
});

app.use(globalLimiter);

// ─── Body parsing ─────────────────────────────────────────────────────────────

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

// ─── Routes ───────────────────────────────────────────────────────────────────

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', version: '1.0.0', timestamp: new Date().toISOString() });
});

app.use('/api/convert', convertLimiter, convertRouter);
app.use('/api/contact', contactRouter);

// ─── Static assets (production only) ─────────────────────────────────────────

if (process.env['NODE_ENV'] === 'production') {
  const clientDist = path.resolve(__dirname, '../../dist/client');
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// ─── Error handling ───────────────────────────────────────────────────────────

app.use((
  err: Error & { code?: string },
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    res.status(413).json({ error: `File too large. Maximum size is ${MAX_FILE_SIZE_MB} MB.` });
    return;
  }
  if (err.code === 'LIMIT_FILE_COUNT') {
    res.status(400).json({ error: 'Too many files uploaded at once.' });
    return;
  }
  if (err.message?.startsWith('Unsupported file type')) {
    res.status(415).json({ error: 'Unsupported file format.' });
    return;
  }
  console.error('[server] Unhandled error:', err.message);
  res.status(500).json({ error: 'An internal server error occurred.' });
});

// ─── Start ────────────────────────────────────────────────────────────────────

const server = app.listen(PORT, () => {
  console.log(`[server] ConvertFlow API running on http://localhost:${PORT}`);
  console.log(`[server] Max file size: ${MAX_FILE_SIZE_MB} MB`);
  cleanupService.startScheduler();
});

// ─── Graceful shutdown ────────────────────────────────────────────────────────

function gracefulShutdown(signal: string) {
  console.log(`[server] Received ${signal}. Shutting down gracefully…`);
  cleanupService.stopScheduler();
  server.close(() => {
    console.log('[server] HTTP server closed.');
    process.exit(0);
  });
  setTimeout(() => {
    console.error('[server] Forced shutdown after timeout.');
    process.exit(1);
  }, 10_000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
