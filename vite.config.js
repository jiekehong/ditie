import { defineConfig } from 'vite';
import { resolve } from 'path';
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  plugins: [viteSingleFile()],
  base: './',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        table: resolve(__dirname, 'table.html'),
        workspace: resolve(__dirname, 'workspace.html')
      }
    }
  }
});
