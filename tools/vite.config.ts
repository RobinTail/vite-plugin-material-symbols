import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import materialSymbols from "../src";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: "./tools/index.html",
    },
  },
  plugins: [react(), materialSymbols()],
});
