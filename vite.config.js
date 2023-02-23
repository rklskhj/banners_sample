import { fileURLToPath, URL } from 'node:url'

import vitePluginStylusAlias from 'vite-plugin-stylus-alias'
import requireTransform from 'vite-plugin-require-transform'
import inject from '@rollup/plugin-inject'
import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import vue2 from '@vitejs/plugin-vue2'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue2(),
    requireTransform.default({}),
    vitePluginStylusAlias.default(),
    /*legacy({
      targets: ['ie >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    }),*/
    inject({
      jQuery: 'jquery',
    }),
  ],
  optimizeDeps: {
    include: ["jquery"],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: true,
    port: '8085'
  }
})
