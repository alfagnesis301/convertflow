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
  // NOTE: vite-prerender-plugin (installed as devDependency) is ESM-only and
  // cannot be required() in this CJS config file. To enable prerendering,
  // add "type": "module" to package.json and convert this config to ESM, then:
  //
  //   import { vitePrerenderPlugin } from 'vite-prerender-plugin';
  //   plugins: [react(), vitePrerenderPlugin({
  //     renderTarget: '#root',
  //     prerenderScript: new URL('./src/prerender.tsx', import.meta.url).pathname,
  //   })],
  //
  // WARNING: Adding "type":"module" will break the server build (server/index.ts
  // compiles to CJS). Separate the client and server build scripts before enabling.
  // The src/prerender.tsx script is ready to use once this is resolved.
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
