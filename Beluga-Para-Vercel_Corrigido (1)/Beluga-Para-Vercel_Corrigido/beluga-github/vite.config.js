import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  base: "./",
  plugins: [react()],
  server: {
    allowedHosts: ["terminal.local"],
  },
  test: {
    environment: "jsdom",
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("/three/build/three.core.js")) return "three-core";
        },
      },
    },
  },
});
