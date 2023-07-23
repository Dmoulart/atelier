import {defineNuxtModule} from "@nuxt/kit";
import path from "path";
import fs, {accessSync, writeFileSync} from "fs";

/**
 * This module create a JSON file containing an array with all the path of the gallery images.
 */
export default defineNuxtModule({
  schema: {
    path: "public/images/gallery",
  },
  setup(options, nuxt) {
    const {path} = options;

    // check if path exists
    accessSync(path);
    nuxt.hooks.hook("build:before", () => {
      try {
        const gallery: string[] = [];

        for (const src of walkSync(path)) {
          const relativeSrc = src.slice(path.length + 1); // remove leading slahs
          if (relativeSrc.endsWith("")) gallery.push(relativeSrc);
        }

        writeFileSync(`public/gallery.json`, JSON.stringify(gallery));
      } catch (e) {
        console.error(
          `Gallery module - Error while registering gallery images : ${e}`
        );
      }
    });
  },
});

function* walkSync(dir: string): Generator<string, any, undefined> {
  const files = fs.readdirSync(dir, {withFileTypes: true});
  for (const file of files) {
    if (file.isDirectory()) {
      yield* walkSync(path.join(dir, file.name));
    } else {
      yield path.join(dir, file.name);
    }
  }
}
