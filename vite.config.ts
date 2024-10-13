import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_VERCEL_ENV': JSON.stringify(process.env.VITE_VERCEL_ENV),
  },
})