import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.API_URL ?? 'http://localhost:5272',
        // Match nginx: report an unreachable API as 502 instead of Vite's default 500.
        configure: (proxy) =>
          proxy.on('error', (_error, _req, res) => {
            if ('writeHead' in res && !res.headersSent) res.writeHead(502).end();
          }),
      },
    },
  },
  test: {
    environment: 'node',
  },
});
