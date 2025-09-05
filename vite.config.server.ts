import { defineConfig } from "vite";
import path from "path";
import { 
  PATH_ALIASES, 
  DEV_CONFIG, 
  NODE_BUILTINS, 
  EXTERNAL_DEPS 
} from "./vite.config.shared";

// =====================================================
// SERVER BUILD CONSTANTS
// =====================================================

const SERVER_ENTRY = path.resolve(__dirname, "server/node-build.ts");
const NODE_TARGET = "node22";

// =====================================================
// SERVER BUILD CONFIGURATION
// =====================================================

export default defineConfig({
  build: {
    // Library configuration
    lib: {
      entry: SERVER_ENTRY,
      name: "server",
      fileName: "production",
      formats: ["es"],
    },

    // Output configuration
    outDir: DEV_CONFIG.SERVER_OUT_DIR,
    target: NODE_TARGET,
    ssr: true,
    minify: false, // Keep readable for debugging
    sourcemap: true,

    // Rollup options
    rollupOptions: {
      external: [...NODE_BUILTINS, ...EXTERNAL_DEPS],
      output: {
        format: "es",
        entryFileNames: "[name].mjs",
      },
    },
  },

  // Path resolution
  resolve: {
    alias: PATH_ALIASES,
  },

  // Environment variables
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});
