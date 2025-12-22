import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Chạy frontend ở cổng 3000
    host: true  // Cho phép truy cập từ mạng nội bộ (nếu cần)
  }
})