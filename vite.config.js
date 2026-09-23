import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `artifact` mode builds a relative-path, hash-routed copy for the shareable preview link.
export default defineConfig(({ mode }) => ({
  base: mode === 'artifact' ? './' : '/',
  plugins: [react()],
  server: { port: 4321 },
}))
