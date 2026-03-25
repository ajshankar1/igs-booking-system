import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: Replace 'igs-booking-system' with your actual GitHub repository name
export default defineConfig({
  plugins: [react()],
  base: '/igs-booking-system/',
})
