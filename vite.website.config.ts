import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

const LIB_NAME = "react-highlighter-words";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist-website",
  },
});
