import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import dts from "vite-plugin-dts";

const LIB_NAME = "react-highlighter-words";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({ rollupTypes: true, tsconfigPath: "./tsconfig.app.json" }),
  ],
  build: {
    lib: {
      entry: path.join(import.meta.dirname, "src/index.ts"),
      name: LIB_NAME,
      fileName: (format) => `${LIB_NAME}.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
