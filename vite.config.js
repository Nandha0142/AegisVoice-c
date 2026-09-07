import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/AegisVoice-c/', // Configured specifically for GitHub Pages repository subdirectory
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  }
})
