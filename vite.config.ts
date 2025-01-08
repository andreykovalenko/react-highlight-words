import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

const LIB_NAME = "react-highlighter-words";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.join(import.meta.dirname, "src/index.ts"),
      name: LIB_NAME,
      fileName: (format) => `${LIB_NAME}.${format}.js`,
    },
  },
});
