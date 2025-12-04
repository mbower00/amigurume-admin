// using code copied from https://vuetifyjs.com/en/getting-started/installation/#option-b-2014-install-via-unplugin-fonts-2b-40fontsource-recommended

import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import ViteFonts from 'unplugin-fonts/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    ViteFonts({
      fontsource: {
        families: [
          {
            name: 'Roboto',
            weights: [100, 300, 400, 500, 700, 900],
            styles: ['normal', 'italic'],
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // server attribute code copied from ChatGPT https://chatgpt.com/c/691342fc-371c-832d-8eb1-71fcadf5972f
  // TODO: "In production, set secure: true once you're confident the certificate is good." (quote from ChatGPT https://chatgpt.com/c/691342fc-371c-832d-8eb1-71fcadf5972f)
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
