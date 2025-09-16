import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
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
});
