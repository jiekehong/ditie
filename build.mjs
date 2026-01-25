import { build } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { viteSingleFile } from "vite-plugin-singlefile";

const __dirname = dirname(fileURLToPath(import.meta.url));

const files = ['index.html', 'table.html', 'workspace.html'];

(async () => {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    console.log(`Building ${file}...`);
    await build({
      configFile: false,
      plugins: [viteSingleFile()],
      base: './',
      build: {
        outDir: 'docs',
        emptyOutDir: i === 0, // Clear on first build
        rollupOptions: {
          input: {
            [file.replace('.html', '')]: resolve(__dirname, file)
          }
        }
      }
    });
  }
})();
