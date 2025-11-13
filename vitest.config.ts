import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { coverageConfigDefaults } from 'vitest/config'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

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
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        ...coverageConfigDefaults.exclude,
        '**/*.config.*',
        '**/vite-env.d.ts',
        '**/test/**',
      ],
    },
  },
})
