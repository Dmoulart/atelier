import { env } from 'node:process'

const cloudName = env.CLD_CLOUDNAME || 'hjtioq99'
const baseUrl = env.BASE_URL || 'https://www.atelier-saint-gue.com'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/image',
    './modules/gallery',
    '@nuxtjs/google-fonts',
    '@transient/nuxt',
    '@nuxtjs/sitemap',
  ],
  transient: { route: '/edit' },
  site: { url: baseUrl },
  sitemap: { exclude: ['/edit', '/admin'] },
  components: [{ path: '~/components', pathPrefix: false }],
  compatibilityDate: '2025-06-08',
  css: ['~/style/global.scss'],
  devtools: { enabled: true },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // bulma 0.9 is pre-@use sass; sass stays on ^1 (still supports all of it). Migrate to bulma 1 before sass 3
          silenceDeprecations: ['import', 'global-builtin', 'if-function', 'color-functions'],
          additionalData: `
          @import "@/style/responsive.scss";
          @import "@/style/vars.scss";
          `,
        },
      },
    },
  },
  googleFonts: {
    download: true,
    preload: true,
    families: {
      Comfortaa: [400, 500, 600, 700],
    },
  },
  image: {
    provider: 'cloudinary',
    cloudinary: {
      baseURL: `https://res.cloudinary.com/${cloudName}/image/upload`,
      modifiers: { fit: 'fill' }, // same crop as ipx's default "cover", cloudinary would distort otherwise
    },
    screens: {
      xs: 320,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1536,
    },
  },
  runtimeConfig: {
    public: {
      BASE_URL: baseUrl,
      BACK_URL: env.BACK_URL || `${baseUrl}/api`,
      CLD_CLOUDNAME: cloudName,
    },
  },
  experimental: {
    payloadExtraction: false,
  },
  routeRules: {
    '/**': { prerender: true },
  },
})
