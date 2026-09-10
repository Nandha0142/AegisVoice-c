import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // Relative base path: Works universally across Vercel, Netlify, GitHub Pages, and Localhost!
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  }
})
