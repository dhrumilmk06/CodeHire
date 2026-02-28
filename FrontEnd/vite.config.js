import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// Silently ignore expected WebSocket connection-abort errors (normal when
// browser tabs close or navigate while a WS proxy connection is still open)
const silentWSErrors = (proxy) => {
  const ignore = (err) => {
    if (err?.code === 'ECONNABORTED' || err?.code === 'ECONNRESET' || err?.code === 'EPIPE') return;
    // Only log actual unexpected errors
    console.error('[proxy error]', err.message);
  };
  proxy.on('error', ignore);
  proxy.on('proxyReqWsError', ignore);
  proxy.on('close', () => { }); // Handle unexpected closure quietly
};

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
      // Proxy all /api calls to the Express backend
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        configure: silentWSErrors,
      },
      // Proxy Piston API requests to Docker container to avoid CORS
      "/piston": {
        target: "http://localhost:2000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/piston/, "/api/v2"),
        configure: silentWSErrors,
      },
      // Proxy Socket.io to the backend (supports WS upgrades)
      "/socket.io": {
        target: "http://localhost:3000",
        changeOrigin: true,
        ws: true,
        configure: silentWSErrors,
      },
    },
  },
})
