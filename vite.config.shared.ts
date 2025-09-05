import path from "path";

// =====================================================
// SHARED VITE CONFIGURATION CONSTANTS
// =====================================================

export const PATH_ALIASES = {
  "@": path.resolve(__dirname, "./client"),
  "@shared": path.resolve(__dirname, "./shared"),
} as const;

export const DEV_CONFIG = {
  PORT: 8080,
  HOST: "::",
  CLIENT_OUT_DIR: "dist/spa",
  SERVER_OUT_DIR: "dist/server",
} as const;

export const SECURITY_CONFIG = {
  ALLOWED_PATHS: ["./client", "./shared"] as string[],
  DENIED_PATHS: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"] as string[],
} as const;

export const NODE_BUILTINS = [
  "fs", "path", "url", "http", "https", "os", "crypto",
  "stream", "util", "events", "buffer", "querystring", "child_process"
] as string[];

export const EXTERNAL_DEPS = ["express", "cors"] as string[];

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

export function createPathAlias(alias: string, target: string) {
  return { [alias]: path.resolve(__dirname, target) };
}

export function isDevelopment(mode: string): boolean {
  return mode === "development";
}

export function isProduction(mode: string): boolean {
  return mode === "production";
}
