import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  test: {
  globals: true,
  environment: "jsdom",
  setupFiles: ['src/_tests_/setup.js'],
},
  plugins: [react()],
})

