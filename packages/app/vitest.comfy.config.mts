import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: {
    environment: 'node',
    include: [
      'src/app/api/resolve/providers/comfyui/**/*.spec.ts',
      'src/components/forms/*Comfy*.spec.tsx',
      'src/components/forms/FormSelect.spec.tsx',
    ],
    pool: 'forks',
    maxWorkers: 2,
    minWorkers: 1,
  },
})
