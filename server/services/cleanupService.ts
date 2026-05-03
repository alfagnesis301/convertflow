import fs from 'fs';
import path from 'path';

// ─── Types ───────────────────────────────────────────────────────────────────

interface TrackedFile {
  filePath: string;
  registeredAt: number; // Unix ms
}

// ─── CleanupService ──────────────────────────────────────────────────────────

class CleanupService {
  private trackedFiles: Map<string, TrackedFile> = new Map();
  private schedulerInterval: ReturnType<typeof setInterval> | null = null;

  private get retentionMs(): number {
    const minutes = parseInt(process.env['FILE_RETENTION_MINUTES'] ?? '30', 10);
    return minutes * 60 * 1000;
  }

  /**
   * Register a temp file so it can be cleaned up.
   * Call this immediately after a file is written to disk.
   */
  register(filePath: string): void {
    this.trackedFiles.set(filePath, {
      filePath,
      registeredAt: Date.now(),
    });
  }

  /**
   * Immediately delete a specific file.
   * Intended to be called right after a successful conversion response.
   */
  deleteNow(filePath: string): void {
    this.safeDelete(filePath);
    this.trackedFiles.delete(filePath);
  }

  /**
   * Immediately delete an array of files (e.g. all inputs + output after serving).
   */
  deleteMany(filePaths: string[]): void {
    for (const fp of filePaths) {
      this.deleteNow(fp);
    }
  }

  /**
   * Scan all tracked files and delete those older than FILE_RETENTION_MINUTES.
   * This is the fallback cleanup pass in case immediate deletion failed.
   */
  runRetentionPass(): void {
    const now = Date.now();
    const expired: string[] = [];

    for (const [key, entry] of this.trackedFiles.entries()) {
      if (now - entry.registeredAt >= this.retentionMs) {
        expired.push(key);
      }
    }

    for (const key of expired) {
      const entry = this.trackedFiles.get(key);
      if (entry) {
        this.safeDelete(entry.filePath);
        this.trackedFiles.delete(key);
      }
    }

    if (expired.length > 0) {
      console.log(`[cleanup] Retention pass removed ${expired.length} expired file(s).`);
    }
  }

  /**
   * Start the periodic background scheduler (every 5 minutes).
   */
  startScheduler(): void {
    if (this.schedulerInterval) return;
    const intervalMs = 5 * 60 * 1000;
    this.schedulerInterval = setInterval(() => {
      this.runRetentionPass();
    }, intervalMs);
    // Allow Node to exit even if the interval is still registered
    if (this.schedulerInterval.unref) {
      this.schedulerInterval.unref();
    }
    console.log('[cleanup] Background scheduler started (every 5 minutes).');
  }

  /**
   * Stop the periodic background scheduler.
   */
  stopScheduler(): void {
    if (this.schedulerInterval) {
      clearInterval(this.schedulerInterval);
      this.schedulerInterval = null;
      console.log('[cleanup] Background scheduler stopped.');
    }
  }

  /**
   * Return the count of currently tracked files (useful for health checks).
   */
  trackedCount(): number {
    return this.trackedFiles.size;
  }

  // ─── Private helpers ──────────────────────────────────────────────────────

  private safeDelete(filePath: string): void {
    try {
      // Only delete files inside the system tmp directory or a known uploads dir
      // to prevent accidental deletion of important files via path manipulation.
      const resolved = path.resolve(filePath);
      const tmpDir = path.resolve(require('os').tmpdir());
      if (!resolved.startsWith(tmpDir)) {
        console.warn(`[cleanup] Refusing to delete file outside tmpdir: ${path.basename(resolved)}`);
        return;
      }

      if (fs.existsSync(resolved)) {
        fs.unlinkSync(resolved);
        // Log only filename, never contents or full path to avoid leaking info
        console.log(`[cleanup] Deleted temp file: ${path.basename(resolved)}`);
      }
    } catch (err) {
      // Log the error but never crash — cleanup failure is non-fatal
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[cleanup] Failed to delete temp file: ${message}`);
    }
  }
}

// Singleton export
export const cleanupService = new CleanupService();
