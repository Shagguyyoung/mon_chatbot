import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(),],
  server: {
    proxy: {
      '/moodle': {
        target: process.env.VITE_MOODLE_URL || 'http://localhost',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/moodle/, '')
      }
    }
  }
})