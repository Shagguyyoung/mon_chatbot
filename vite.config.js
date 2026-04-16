import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(),],
  server: {
    proxy: {
      '/moodle': {
        target: import.meta.env.VITE_MOODLE_URL || 'http://localhost',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/moodle/, '')
      }
    }
  }
})