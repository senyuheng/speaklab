import { defineConfig } from 'vite';

// base './' makes the build use relative paths, deployable under any GH Pages sub-path
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
