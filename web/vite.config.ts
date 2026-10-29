import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';
import { defineConfig } from 'vitest/config';

const LEGACY_DATA_DIR = fileURLToPath(new URL('../data', import.meta.url));

/**
 * Serve os JSON de ../data (a "API" mockada compartilhada com o app AngularJS) em /data/*
 * no dev server e copia os arquivos para dist/data no build, sem duplicá-los no repositório.
 */
function legacyData(): Plugin {
  return {
    name: 'legacy-data',
    configureServer(server) {
      server.middlewares.use('/data', async (req, res, next) => {
        const nome = decodeURIComponent((req.url ?? '').split('?')[0]).replace(/^\/+/, '');
        const arquivo = path.resolve(LEGACY_DATA_DIR, nome);
        if (!nome.endsWith('.json') || path.dirname(arquivo) !== LEGACY_DATA_DIR) {
          return next();
        }
        try {
          const conteudo = await readFile(arquivo);
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(conteudo);
        } catch {
          next();
        }
      });
    },
    async generateBundle() {
      for (const nome of await readdir(LEGACY_DATA_DIR)) {
        if (!nome.endsWith('.json')) continue;
        this.emitFile({
          type: 'asset',
          fileName: `data/${nome}`,
          source: await readFile(path.join(LEGACY_DATA_DIR, nome)),
        });
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), legacyData()],
  server: { port: 5173 },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    coverage: {
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/main.tsx', 'src/test/**'],
    },
  },
});
