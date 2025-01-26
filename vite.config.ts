import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/json-to-table/',
  plugins: [
    tailwindcss(),
  ],
});