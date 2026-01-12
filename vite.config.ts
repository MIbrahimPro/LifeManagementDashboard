import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        tailwindcss({
            config: {
                content: [
                    './index.html',
                    './src/**/*.{js,ts,jsx,tsx}',
                ],
                darkMode: '[data-mode="dark"]',
                theme: {
                    extend: {},
                },
                plugins: [],
            }
        }),
        react()
    ],
})
