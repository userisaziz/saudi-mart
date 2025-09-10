import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/',
  define: {
    global: 'globalThis',
    // Fix for potential initialization issues
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/shared": path.resolve(__dirname, "./src/shared"),
      "@/admin": path.resolve(__dirname, "./src/admin"),
      "@/seller": path.resolve(__dirname, "./src/seller"),
      "@/auth": path.resolve(__dirname, "./src/auth"),
      "@/assets": path.resolve(__dirname, "./src/assets")
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
  },
  server: {
    port: 5173,
    open: true,
    host: true,
    cors: true,
    strictPort: false,
    fs: {
      strict: false
    }
  },
  preview: {
    port: 4173,
    host: true,
    cors: true
  },
  build: {
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV !== 'production',
    minify: 'esbuild',
    target: 'es2015',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'react-router': ['react-router-dom'],
          'ui-vendor': [
            '@radix-ui/react-dialog', 
            '@radix-ui/react-dropdown-menu', 
            '@radix-ui/react-select', 
            '@radix-ui/react-tabs',
            '@radix-ui/react-accordion',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox'
          ],
          'chart-vendor': ['recharts'],
          'icon-vendor': ['lucide-react', '@heroicons/react'],
          'utils-vendor': ['clsx', 'tailwind-merge', 'date-fns'],
          'state-vendor': ['zustand'],
          'http-vendor': ['axios']
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      'lucide-react',
      '@heroicons/react',
      'recharts',
      'zustand',
      'clsx',
      'tailwind-merge'
    ],
    exclude: ['@vite/client', '@vite/env']
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    keepNames: true,
    legalComments: 'none'
  }
})