import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      include: '**/*.{jsx,js}',  // ← add this line
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000', // <-- your Express server's actual port
        changeOrigin: true,
      },
    },
  },
})