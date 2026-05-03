import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Note: "type": "module" is intentionally absent from package.json.
// The server (server/index.ts) compiles to CommonJS via tsconfig.server.json and
// is run with `node dist/server/index.js`, which requires CJS semantics.
// Adding "type": "module" would break that. The Node.js ES module warning that
// appears during `npx vite build` is harmless — Vite handles its own ESM loading.
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist/client',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
          icons: ['lucide-react'],
          utils: ['clsx'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
