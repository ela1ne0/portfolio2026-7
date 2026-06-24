import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/portfolio2026-7-2/',
  build: {
    rollupOptions: {
      input: {
        main:  resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        play:  resolve(__dirname, 'play.html'),
      }
    }
  }
})
