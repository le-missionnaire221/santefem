import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        presentation: "presentation.html",
        cabinet: "cabinet/index.html",
        patiente: "patiente/index.html"
      }
    }
  }
});
