import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        background: resolve(__dirname, 'src/background.ts'),
        content: resolve(__dirname, 'src/content.ts'),
        inject: resolve(__dirname, 'src/inject.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (['background', 'content', 'inject'].includes(chunkInfo.name)) {
            return '[name].js';
          }
          return 'assets/[name]-[hash].js';
        },
        // Ensure rules.ts gets bundled into background.js, not a separate chunk
        manualChunks: undefined,
      },
    },
  },
});
