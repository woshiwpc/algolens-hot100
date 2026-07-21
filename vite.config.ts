import { cloudflare } from '@cloudflare/vite-plugin'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { sites } from './build/sites-vite-plugin.js'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    sites(),
    cloudflare({ viteEnvironment: { name: 'server' } }),
  ],
})
