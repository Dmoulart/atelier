import { writeFileSync } from 'node:fs'
import { defineNuxtModule } from '@nuxt/kit'
import { encode } from 'blurhash'
import sharp from 'sharp'
import { blurHashToDataURL } from './blurhash-data-uri'

const FOLDER = 'gallery'

/**
 * Lists the Cloudinary gallery folder at build time and writes the JSON files used by the app:
 * the list of images, their blur placeholders and the ordered "creations et commandes" album.
 */
export default defineNuxtModule({
  setup(_options, nuxt) {
    nuxt.hooks.hook('build:before', async () => {
      const { CLD_CLOUDNAME: cloud, CLD_API_KEY: key, CLD_API_SECRET: secret } = process.env
      if (!cloud || !key || !secret) {
        console.warn('Gallery module - CLD_* env vars missing, keeping existing gallery JSON files')
        return
      }
      try {
        const auth = `Basic ${Buffer.from(`${key}:${secret}`).toString('base64')}`
        const resources: { public_id: string; format: string }[] = []
        let next: string | undefined
        do {
          const url = `https://api.cloudinary.com/v1_1/${cloud}/resources/image/upload?prefix=${FOLDER}/&max_results=500${next ? `&next_cursor=${next}` : ''}`
          const res = await fetch(url, { headers: { Authorization: auth } })
          if (!res.ok) throw new Error(`Cloudinary API ${res.status}`)
          const json = await res.json()
          resources.push(...json.resources)
          next = json.next_cursor
        } while (next)

        // file names keep their extension: "CreationsEtCommandes/1.jpg"
        const files = resources
          .map((r) => ({ id: r.public_id, name: `${r.public_id.slice(FOLDER.length + 1)}.${r.format}` }))
          .sort((a, b) => a.name.localeCompare(b.name))

        const placeholders: Record<string, string> = {}
        await Promise.all(
          files.map(async ({ id, name }) => {
            const thumb = await fetch(
              `https://res.cloudinary.com/${cloud}/image/upload/w_32,h_32,c_limit,f_png/${id}`,
            )
            const blurhash = await encodeImageToBlurhash(Buffer.from(await thumb.arrayBuffer()))
            placeholders[`/gallery/${name}`] = blurHashToDataURL(blurhash) ?? ''
          }),
        )

        // every file name of the album should consist of a number and file extension
        const PREFIX = 'CreationsEtCommandes/'
        const creations = files
          .map((f) => f.name)
          .filter((n) => n.startsWith(PREFIX))
          .sort((a, b) => parseInt(a.slice(PREFIX.length), 10) - parseInt(b.slice(PREFIX.length), 10))

        writeFileSync('app/assets/gallery.json', JSON.stringify(files.map((f) => f.name)))
        writeFileSync('app/assets/gallery-placeholders.json', JSON.stringify(placeholders))
        writeFileSync('app/assets/gallery-creations-et-commandes.json', JSON.stringify(creations))
      } catch (e) {
        console.error(`Gallery module - Error while registering gallery images : ${e}`)
      }
    })
  },
})

const encodeImageToBlurhash = async (input: Buffer): Promise<string> => {
  const { data, info } = await sharp(input)
    .raw()
    .ensureAlpha()
    .resize(32, 32, { fit: 'inside' })
    .toBuffer({ resolveWithObject: true })
  return encode(new Uint8ClampedArray(data), info.width, info.height, 4, 4)
}

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
