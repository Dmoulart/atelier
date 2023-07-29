import {readdirSync} from "fs";
import {env} from "process";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/image",
    ["./modules/gallery", {path: "public/images/gallery"}],
  ],
  css: ["~/style/global.scss"],
  devtools: {enabled: true},
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
          @import "@/style/responsive.scss";
          @import "@/style/vars.scss";
          `,
        },
      },
    },
  },
  image: {
    provider: "ipx",
    dir: "public/images",
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
      BASE_URL: env.BASE_URL || "http://localhost:3000",
    },
  },
  experimental: {
    payloadExtraction: false,
  },
});
