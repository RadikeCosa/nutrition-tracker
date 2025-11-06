import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  test: {
    // Usa jsdom para simular el navegador
    environment: "jsdom",

    // Permite usar expect, describe, it sin importarlos
    globals: true,

    // Archivo de setup que se ejecuta antes de cada test
    setupFiles: "./tests/setup.ts",

    // Cobertura de código
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "tests/", "*.config.ts", "*.config.js"],
    },
  },
  resolve: {
    // Alias para imports absolutos (opcional pero recomendado)
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
