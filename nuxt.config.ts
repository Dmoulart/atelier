import {readdirSync} from "fs";

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
  // hooks: {
  //   "build:done": () => {
  //     const gallery = readdirSync("public/images/gallery");
  //     console.log("gallery", {gallery});
  //   },
  // },
});
