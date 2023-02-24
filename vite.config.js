import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  base: mode === 'build' ? '/notes-app/' : '/',
  build: {
    outDir: 'build',
  },
})
