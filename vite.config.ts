
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // ONLY public keys should be here. 
    // The Gemini API_KEY is a secret and must only exist on the server (Vercel Functions).
    'process.env.RAZORPAY_KEY_ID': JSON.stringify(process.env.RAZORPAY_KEY_ID)
  },
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
