import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // The deployable site is mirrored below /demo/ on GitHub Pages and can also
  // be served from any static preview root.
  base: './',
  server: {
    host: true,
    port: 3000
  },
  build: {
    // Keep the wallet-only Web3 stack out of the entry-page preload list.
    // The lazy Sepolia console will request these chunks when #sepolia opens.
    modulePreload: {
      resolveDependencies(filename, deps, { hostType }) {
        if (hostType !== 'html') return deps
        return deps.filter((dependency) => (
          !dependency.includes('web3-')
          && !dependency.includes('SpkV1Console-')
        ))
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'react'
          if (id.includes('node_modules/ethers')) return 'web3'
          if (id.includes('node_modules/recharts')) return 'charts'
          if (id.includes('node_modules/lucide-react')) return 'icons'
          return undefined
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    globals: true,
    exclude: ['**/node_modules/**', '**/archive/**'],
  },
})
