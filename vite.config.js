import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    // Split heavy, rarely-changing dependencies into their own long-cacheable
    // chunks so the app shell and route chunks stay small.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('@supabase')) return 'vendor-supabase'
          if (id.includes('react-router') || id.includes('/react-dom/') || id.includes('/react/')) return 'vendor-react'
          return 'vendor'
        },
      },
    },
    chunkSizeWarningLimit: 700,
  },
})
