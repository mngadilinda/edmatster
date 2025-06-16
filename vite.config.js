import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {  // Changed from '/auth' to more generic '/api'
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  optimizeDeps: {
    include: ['@heroicons/react', 'katex']
  },
  // Add this build configuration
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true
  }
})