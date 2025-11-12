import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { coverageConfigDefaults } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        ...coverageConfigDefaults.exclude,
        '**/*.config.*',
        '**/vite-env.d.ts',
      ],
    },
  },
})
