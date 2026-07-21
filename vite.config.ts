import { cloudflare } from '@cloudflare/vite-plugin'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { sites } from './build/sites-vite-plugin.js'

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/algolens-hot100/' : '/',
  plugins: [
    react(),
    tailwindcss(),
    sites(),
    cloudflare({ viteEnvironment: { name: 'server' } }),
  ],
})
