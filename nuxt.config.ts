// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  sourcemap: false,
  future: {
    compatibilityVersion: 4,
  },
  modules: ['@nuxt/ui', '@nuxt/eslint', '@vueuse/nuxt'],
  eslint: {
    config: {
      standalone: false,
    },
  },
  vite: {
    optimizeDeps: {
      exclude: ['@vue/repl'],
    },
    build: {
      rollupOptions: {
        external: ['typescript', '@vue/compiler-sfc'],
      },
    },
    ssr: {
      noExternal: ['@vue/repl'],
    },
  },
  css: ['~/assets/css/main.css'],
})
