import {readdirSync} from "fs";
import {env} from "process";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/image",
    ["./modules/gallery", {path: "public/images/gallery"}],
  ],

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
  runtimeConfig: {
    public: {
      BASE_URL: env.BASE_URL || "http://localhost:3000",
    },
  },
});
