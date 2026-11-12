import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    open: false,
    proxy: { '/api': 'http://127.0.0.1:3001' },
  },
  preview: { port: 3000, strictPort: true, proxy: { '/api': 'http://127.0.0.1:3001' } },
});
