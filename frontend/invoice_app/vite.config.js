import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import commonjs from "vite-plugin-commonjs";

export default defineConfig({
  plugins: [react(), commonjs()],
  base: "./", // Menggunakan path relatif
  build: {
    outDir: "dist",
    assetsDir: "assets",
    commonjsOptions: { transformMixedEsModules: true }, // Lokasi folder assets di dist
  },
});
