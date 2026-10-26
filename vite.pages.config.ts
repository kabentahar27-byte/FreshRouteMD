import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/postcss';
import path from 'node:path';
export default defineConfig({base:'/FreshRouteMD/',plugins:[react()],css:{postcss:{plugins:[tailwind()]}},resolve:{alias:{'@':path.resolve('.'),'next/link':path.resolve('pages/link.tsx'),'next/navigation':path.resolve('pages/navigation.ts')}},build:{outDir:'dist-pages'}});
