import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // Ensures assets are loaded relative to repository root for GitHub Pages
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  }
})
