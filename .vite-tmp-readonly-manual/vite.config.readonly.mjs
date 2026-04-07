import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: 'C:/Users/gzliuyifeng/WorkBuddy/20260403153329/app/.vite-tmp-readonly-manual',
  base: './',
  build: {
    outDir: 'C:/Users/gzliuyifeng/WorkBuddy/20260403153329/app/.vite-tmp-readonly-manual/dist',
    emptyOutDir: true,
    cssCodeSplit: false,
    modulePreload: false,
    rollupOptions: {
      input: 'C:/Users/gzliuyifeng/WorkBuddy/20260403153329/app/.vite-tmp-readonly-manual/index.html',
      output: {
        format: 'es',
        inlineDynamicImports: true,
        entryFileNames: 'app.js',
        assetFileNames: 'app.[ext]',
      },
    },
  },
  logLevel: 'warn',
})
