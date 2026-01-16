import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: Replace 'Solarpunk-bitcoin' with your actual repository name
  // If deploying to a custom domain or Vercel, you can remove this line or set it to '/'
  base: './', 
  server: {
    host: true,
    port: 3000
  }
})