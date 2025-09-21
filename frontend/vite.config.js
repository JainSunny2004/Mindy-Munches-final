import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react({
        jsxRuntime: "automatic", // or 'classic' if automatic doesn't work
      }),
      tailwindcss(),
    ],
    server: {
      port: 3000,
    },
    external: ["react", "react-dom"],
    optimizeDeps: {
      include: ["react/jsx-runtime"],
    },
    // Build-time console removal for production
    esbuild: {
      pure: mode === 'production' ? ['console.log', 'console.debug', 'console.info', 'console.warn'] : [],
      drop: mode === 'production' ? ['console', 'debugger'] : []
    },
    // Build configuration
    build: {
      // Remove console statements during minification
      minify: 'esbuild',
      rollupOptions: {
        output: {
          // Clean up console statements in production chunks
          manualChunks: undefined,
        }
      }
    }
  }
});
