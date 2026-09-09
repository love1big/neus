import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
      dedupe: ['react', 'react-dom', 'react/jsx-runtime'],
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'lucide-react', 'motion/react'],
    },
    server: {
      watch: {
        usePolling: true,
      },
    },
    build: {
      target: 'esnext',
      minify: false,
      sourcemap: false,
      reportCompressedSize: false,
      modulePreload: false,
      chunkSizeWarningLimit: 4000,
      rollupOptions: {
        maxParallelFileOps: 2,
      },
    }
  };
});
