import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite'


export default defineConfig({
   optimizeDeps: {
    include: [
      'react', 
      'react/jsx-runtime', 
      'react-dom'
    ],
  },
  plugins: [tanstackRouter({
    target: 'react',
    autoCodeSplitting: true,
  }), react(), sentryVitePlugin({
    org: "ehealthwares",
    project: "rxsoft-admin"
  })],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.mjs',
  },

  resolve: {
    tsconfigPaths: true,
  },
  build: {
    minify: false,
    sourcemap: true
  },
  server: {
    allowedHosts: ['kyung-unexempted-brunilda.ngrok-free.dev']
  }
});
