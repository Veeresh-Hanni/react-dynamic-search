import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'], // produces dist/index.js (CJS) + dist/index.mjs (ESM)
  dts: true,               // generates dist/index.d.ts for TypeScript consumers
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: process.env.NODE_ENV === 'production', // minified only for production builds
  external: ['react', '@tanstack/react-query'],   // never bundle peer deps
});
