import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main:  resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        play:  resolve(__dirname, 'play.html'),
        work:  resolve(__dirname, 'work/coming-soon.html'),
        aboutSoon: resolve(__dirname, 'about-coming-soon.html'),
        trains: resolve(__dirname, 'about-the-trains.html'),
      }
    }
  }
})
