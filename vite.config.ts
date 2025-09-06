/// <reference types="vite/client" />

import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    cssTarget: 'chrome61',
    sourcemap: true,
    rollupOptions: {
      external: ['klinecharts', 'solid-js', 'lodash'],
      output: {
        assetFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'style.css') {
            return 'klinecharts-pro.css'
          }
          return chunkInfo.name || 'assets/[name].[ext]'
        },
        globals: {
          'klinecharts': 'klinecharts',
          'solid-js': 'SolidJS',
          'lodash': 'lodash'
        },
      },
    },
    lib: {
      entry: './src/index.ts',
      name: 'klinechartspro',
      formats: ['es', 'umd'],
      fileName: (format) => {
        if (format === 'es') {
          return 'klinecharts-pro.js'
        }
        if (format === 'umd') {
          return 'klinecharts-pro.umd.js'
        }
        return `klinecharts-pro.${format}.js`
      }
    }
  }
})
