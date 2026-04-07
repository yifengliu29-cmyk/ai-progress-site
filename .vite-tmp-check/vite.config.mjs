import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: 'C:\Users\gzliuyifeng\WorkBuddy\20260403153329\app\.vite-tmp-check',
  base: './',
  build: {
    outDir: 'C:\Users\gzliuyifeng\WorkBuddy\20260403153329\app\.vite-tmp-check\dist',
    emptyOutDir: true,
    cssCodeSplit: false,
    modulePreload: false,
    rollupOptions: {
      output: {
        format: 'iife',
        inlineDynamicImports: true,
        entryFileNames: 'app.js',
        assetFileNames: 'app.[ext]',
      },
    },
  },
  logLevel: 'warn',
})