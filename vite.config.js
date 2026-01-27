import { defineConfig } from 'vite'

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: './index.html',
        felipe: './felipe-maiocch.html'
      }
    },
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: true
  },
  publicDir: 'public',
  server: {
    port: 5174,
    host: true,
    open: false
  },
  preview: {
    port: 4173
  }
})
