import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            'plotly.js': '/node_modules/plotly.js/dist/plotly-custom.min.js',
        },
    },
});
