import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  root: 'C:/Users/gzliuyifeng/WorkBuddy/20260403153329/app/.vite-tmp-debug3',
  base: './',
  build: {
    outDir: 'C:/Users/gzliuyifeng/WorkBuddy/20260403153329/app/.vite-tmp-debug3/dist',
    emptyOutDir: true,
    cssCodeSplit: false,
    modulePreload: false,
    rollupOptions: {
      input: 'C:/Users/gzliuyifeng/WorkBuddy/20260403153329/app/.vite-tmp-debug3/index.html',
    },
  },
  logLevel: 'warn',
})