import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const src = path.resolve(__dirname, 'src')

const fsdLayers = [
  'app',
  'pages',
  'widgets',
  'features',
  'entities',
  'shared',
] as const

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      ...fsdLayers.map((layer) => ({
        find: `@/${layer}`,
        replacement: path.join(src, layer),
      })),
      { find: '@/test', replacement: path.join(src, 'test') },
    ],
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'dist/',
        'src/test/setup.ts',
        '**/*.{test,spec}.{ts,tsx}',
        '**/*.d.ts',
        '**/index.html',
      ],
    },
  },
})
