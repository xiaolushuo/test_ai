import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        navigateFallbackDenylist: [/^\/api\//],
      },
      manifest: {
        name: 'NotePWA',
        short_name: 'NotePWA',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ef4444',
        icons: [],
      },
    }),
  ],
})
