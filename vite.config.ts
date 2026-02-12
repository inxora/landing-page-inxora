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
  // Proxy /api/* a app.inxora.com (evita CORS, mismo patrón que ecommerce-inxora)
  server: {
    proxy: {
      '/api': {
        target: 'https://app.inxora.com',
        changeOrigin: true,
      },
    },
  },
});