import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // Proxy Piston API requests to Docker container to avoid CORS
      "/piston": {
        target: "http://localhost:2000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/piston/, "/api/v2"),
      },
      // Proxy Socket.io to the backend (supports WS upgrades)
      "/socket.io": {
        target: "http://localhost:3000",
        changeOrigin: true,
        ws: true,
      },
    },
  },
})
