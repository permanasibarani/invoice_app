import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./", // Menggunakan path relatif
  build: {
    outDir: "dist",
    assetsDir: "assets", // Lokasi folder assets di dist
  },
});
