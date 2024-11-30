import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import materialSymbols from "./src";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), materialSymbols()],
});
