import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import RemoveConsole from 'vite-plugin-remove-console';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), RemoveConsole()],
  
})


