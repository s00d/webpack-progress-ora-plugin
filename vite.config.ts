import { resolve } from 'node:path';

import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  ssr: {
    noExternal: ['ora', 'chalk', 'log-update'],
  },
  build: {
    ssr: true,
    target: 'node20',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'WebpackProgressOraPlugin',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
    },
    rollupOptions: {
      external: ['webpack'],
    },
    sourcemap: true,
    minify: false,
  },
  plugins: [
    dts({
      include: ['src'],
      rollupTypes: true,
    }),
  ],
  test: {
    globals: false,
    environment: 'node',
    testTimeout: 10_000,
    setupFiles: ['./test/setup.ts'],
  },
});
