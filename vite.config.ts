import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Explicitly declare process to avoid TS2580 error if @types/node is missing or not picked up
declare const process: { env: Record<string, string>; cwd: () => string };

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Map the 'API_KEY' from system/Netlify to 'import.meta.env.VITE_API_KEY'
      // This makes it available to the client-side code securely during the build
      'import.meta.env.VITE_API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY)
    }
  };
});