import react from '@vitejs/plugin-react-swc';
import {defineWorkspace} from 'vitest/config';

export default defineWorkspace([
    {
        plugins: [react()],
        test: {
            name: 'unit',
            include: ['src/**/**.unit.{ts,tsx}'],
            globals: true,
            globalSetup: ['./vitest.globals.ts'],
            setupFiles: ['./vitest.setup.ts'],
            environment: 'jsdom',
        }
    }
])