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
        // Cache headers
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(css)$/.test(assetInfo.name)) {
            return `assets/[name]-[hash].${ext}`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name)) {
            return `assets/[name]-[hash].${ext}`;
          }
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/.test(assetInfo.name)) {
            return `assets/[name]-[hash].${ext}`;
          }
          // return `assets/[name]-[hash].${ext}`;
        },
      },
    },
    // Optimize chunk size and loading
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  // Performance optimizations
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },
}));
