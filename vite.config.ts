import { defineConfig } from 'vite';

// base './'：构建产物用相对路径，可直接部署到 GitHub Pages 子路径（/repo/）
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    target: 'es2020',
  },
  server: {
    port: 5173,
  },
});
