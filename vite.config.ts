import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'node:path';
import { existsSync, readdirSync, rmSync } from 'node:fs';
import path from 'path';
import react from '@vitejs/plugin-react';

emptyDir(resolve(__dirname, 'dist'));

export default defineConfig({
    plugins: [dts({ rollupTypes: true }), react()],
    base: './',
    build: {
        sourcemap: true,
        outDir: './dist',
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'eventrix',
            formats: ['es', 'cjs', 'umd', 'iife'],
            fileName: (format) => `index.${format}.js`,
        },
        rollupOptions: {
            external: ['react', 'react-dom'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                },
            },
        },
    },
});

function emptyDir(dir: string) {
    if (!existsSync(dir)) {
        return;
    }

    for (const file of readdirSync(dir)) {
        rmSync(resolve(dir, file), { recursive: true, force: true });
    }
}
