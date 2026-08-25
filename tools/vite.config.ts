import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import materialSymbols from "../src/index.ts";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rolldownOptions: {
      input: "./tools/index.html",
    },
  },
  plugins: [react(), materialSymbols()],
});
