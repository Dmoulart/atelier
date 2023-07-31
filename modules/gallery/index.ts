import {defineNuxtModule} from "@nuxt/kit";
import path from "path";
import fs, {accessSync, writeFileSync} from "fs";
import {encode} from "blurhash";
import sharp from "sharp";
import {blurHashToDataURL} from "./blurhash-data-uri";

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

    nuxt.hooks.hook("build:before", async () => {
      try {
        const gallery: string[] = [];
        const placeholders: Record<string, string> = {};

        // create creations-et-commandes gallery
        // @todo : in this spirit make an image selection for each specific carousel at build time
        const creationsAndOrderGallery: string[] = [];
        const CREATIONS_AND_GALLERY_PREFIX = "CreationsEtCommandes";

        for (const src of walkSync(path)) {
          const relativeSrc = src.slice(path.length + 1); // remove leading slash
          gallery.push(relativeSrc);

          const blurhash = await encodeImageToBlurhash(src);
          const dataUri = blurHashToDataURL(blurhash) ?? "";
          placeholders[`/gallery/${relativeSrc}`] = dataUri;

          if (relativeSrc.startsWith(CREATIONS_AND_GALLERY_PREFIX)) {
            creationsAndOrderGallery.push(relativeSrc);
          }
        }

        writeFileSync(`assets/gallery.json`, JSON.stringify(gallery));
        writeFileSync(
          `assets/gallery-placeholders.json`,
          JSON.stringify(placeholders)
        );

        // order creations et commandes
        // every file name should consist of a number and file extension
        creationsAndOrderGallery.sort((a, b) => {
          const numA = a
            .split(".")[0]
            .substring((CREATIONS_AND_GALLERY_PREFIX + "/").length);
          const numB = b
            .split(".")[0]
            .substring((CREATIONS_AND_GALLERY_PREFIX + "/").length);

          return Number(numA) - Number(numB);
        });
        writeFileSync(
          `assets/gallery-creations-et-commandes.json`,
          JSON.stringify(creationsAndOrderGallery)
        );
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
const encodeImageToBlurhash = async (path: string): Promise<string> =>
  new Promise((resolve, reject) => {
    sharp(path)
      .raw()
      .ensureAlpha()
      .resize(32, 32, {fit: "inside"})
      .toBuffer((err, buffer, {width, height}) => {
        if (err) return reject(err);
        resolve(encode(new Uint8ClampedArray(buffer), width, height, 4, 4));
      });
  });

// const loadImage = async (src: string) =>
//   new Promise((resolve, reject) => {
//     const img = new Image();
//     img.onload = () => resolve(img);
//     img.onerror = (...args) => reject(args);
//     img.src = src;
//   });

// const getImageData = (image: HTMLImageElement) => {
//   const canvas = document.createElement("canvas");
//   canvas.width = image.width;
//   canvas.height = image.height;
//   const context = canvas.getContext("2d")!;
//   context.drawImage(image, 0, 0);
//   return context.getImageData(0, 0, image.width, image.height);
// };

// async function encodeImageToBlurhash(imageUrl: string) {
//   const image = (await loadImage(imageUrl)) as HTMLImageElement;
//   const imageData = getImageData(image);
//   return encode(imageData.data, imageData.width, imageData.height, 4, 4);
// }

// async function encodeImage() {
//   const getImageData = (image: Image) => {
//     const canvas = createCanvas(image.width, image.height);
//     const context = canvas.getContext("2d");
//     context.drawImage(image, 0, 0);
//     return context.getImageData(0, 0, image.width, image.height);
//   };

//   const image = await loadImage("https://fakeimg.pl/300/");
//   console.log(" image = ", image.width, image.height);
//   const imageData = getImageData(image);
//   return blurhash.encode(
//     imageData.data,
//     imageData.width,
//     imageData.height,
//     4,
//     4
//   );
// }
