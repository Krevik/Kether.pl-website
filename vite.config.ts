import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => ({
  plugins: [react(), tsconfigPaths()],
  base: '/',
  build: {
    outDir: 'build',
    sourcemap: mode === 'development', // sourcemaps only in dev mode
    rollupOptions: {
      external: ['chart.js/auto'],
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux', 'redux-persist'],
          'primereact': ['primereact/button', 'primereact/datatable', 'primereact/column', 'primereact/dialog', 'primereact/dropdown', 'primereact/toolbar', 'primereact/inputtext', 'primereact/inputnumber', 'primereact/toast'],
          'i18n': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  optimizeDeps: {
    include: ['primeicons'],
  },
}));
