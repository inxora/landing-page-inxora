import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      // En desarrollo, proxy /api/* a app.inxora.com para evitar CORS
      '/api': {
        target: 'https://app.inxora.com',
        changeOrigin: true,
      },
    },
  },
});