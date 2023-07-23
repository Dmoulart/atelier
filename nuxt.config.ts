// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/image"],
  devtools: {enabled: true},
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
          @import "@/style/responsive.scss";
          @import "@/style/global.scss";
          `,
        },
      },
    },
  },
  image: {
    dir: "public/images",
    
  },
});
