import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,  // Vite'in dinleyeceği port
    open: true,  // Sunucu başladığında tarayıcıyı otomatik aç
  },
});
