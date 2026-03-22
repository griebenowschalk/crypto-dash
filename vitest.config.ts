import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { coverageConfigDefaults } from 'vitest/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__test__/setup.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', 'docs/**'],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        ...coverageConfigDefaults.exclude,
        '**/*.config.*',
        '**/vite-env.d.ts',
        '**/src/__test__/**',
      ],
    },
  },
});
