import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
// IMPORTANT: Avoid importing the server during build to prevent DB side-effects
// We'll dynamically import inside the dev-only plugin instead
import { 
  PATH_ALIASES, 
  DEV_CONFIG, 
  SECURITY_CONFIG, 
  isDevelopment, 
  isProduction 
} from "./vite.config.shared";

// =====================================================
// EXPRESS PLUGIN FOR DEVELOPMENT
// =====================================================

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development
    async configureServer(server) {
      const { createServer } = await import("./server");
      const app = createServer();
      server.middlewares.use(app);
    },
  };
}

// =====================================================
// MAIN VITE CONFIGURATION
// =====================================================

export default defineConfig(({ mode }) => ({
  // Development server configuration
  server: {
    host: DEV_CONFIG.HOST,
    port: DEV_CONFIG.PORT,
    fs: {
      allow: SECURITY_CONFIG.ALLOWED_PATHS,
      deny: SECURITY_CONFIG.DENIED_PATHS,
    },
  },

  // Build configuration
  build: {
    outDir: DEV_CONFIG.CLIENT_OUT_DIR,
    sourcemap: isDevelopment(mode),
    minify: isProduction(mode),
  },

  // Plugins
  plugins: [react(), expressPlugin()],

  // Path resolution
  resolve: {
    alias: PATH_ALIASES,
  },

  // Environment variables
  define: {
    __DEV__: isDevelopment(mode),
  },
}));
