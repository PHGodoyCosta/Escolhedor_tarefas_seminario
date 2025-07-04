import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'

export default defineConfig({
    plugins: [react()],
    root: './src/Renderer-2',
    build: {
        outDir: path.join(__dirname, "src/dist/renderer"),
        //outDir: '../../dist/renderer',
        emptyOutDir: true
    },
    server: {
        port: 3000
    }
});