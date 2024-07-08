import { defineConfig } from "vite";

export default defineConfig({
  root: "front/views",
  build: {
    outDir: "../../dist",
    emptyOutDir: true,
  },
});
