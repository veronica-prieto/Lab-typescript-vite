import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  root: 'src',
  base: './',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src')
    }
  }
})