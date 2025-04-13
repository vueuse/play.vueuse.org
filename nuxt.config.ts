// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
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
        external: ['typescript'],
      },
    },
    ssr: {
      noExternal: ['@vue/repl'],
    },
  },
  css: ['~/assets/css/main.css'],
})
