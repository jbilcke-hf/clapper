import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
 
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    exclude: [
      '**/node_modules/**',
      '**/.next/**',
      '**/tests/**', // <- we ignore since those are Playwright tests, not Vitest tests
    ],
  }
})