import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: [
      '@apollo/client',
      '@apollo/client/react',
      '@apollo/client/core',
      '@apollo/client/link/http',
      '@apollo/client/link/context',
      '@apollo/client/link/error',
    ],
  },
  server: {
    proxy: {
      // Any request to /graphql from the frontend is forwarded to the backend
      // server-side — so the browser never sees a cross-origin request.
      '/graphql': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
