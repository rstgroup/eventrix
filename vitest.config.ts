import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        coverage: {
            reporter: ['html', 'lcov', 'text'],
        },
    },
});
