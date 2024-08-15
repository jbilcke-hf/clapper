import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // resolve monorepo packages
  resolve: {
    alias: {
      "@aitube/clap": path.resolve(__dirname, "../clap/dist"),
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..'],
    },
  },
  optimizeDeps: {
    exclude: ['@aitube/clap'], // Exclude the clap package from pre-bundling
  },
})