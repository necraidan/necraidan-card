import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: ['src/card.ts'],
    format: ['esm'],
    target: 'node18',
    clean: true,
    banner: {
        js: '#!/usr/bin/env node',
    },
});
