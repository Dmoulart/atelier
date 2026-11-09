import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { defineNuxtModule } from '@nuxt/kit'

// placeholders are only used by the heroes: collect their `bg-image="..."` from the pages
const heroImages = (): Set<string> =>
  new Set(
    readdirSync('app/pages', { recursive: true, encoding: 'utf8' })
      .filter((f) => f.endsWith('.vue'))
      .flatMap((f) => [
        ...readFileSync(`app/pages/${f}`, 'utf8').matchAll(/<Hero[^>]*\sbg-image="([^"]+)"/g),
      ])
      .map((m) => m[1]!),
  )

/**
 * Writes the blur placeholders of the heroes' background images at build time:
 * Cloudinary does the blur, we only inline the tiny result as a data URI.
 */
export default defineNuxtModule({
  setup(_options, nuxt) {
    nuxt.hooks.hook('build:before', async () => {
      const cloud = process.env.CLD_CLOUDNAME
      if (!cloud) {
        console.warn('Gallery module - CLD_CLOUDNAME missing, keeping existing placeholders file')
        return
      }
      try {
        const placeholders = Object.fromEntries(
          await Promise.all(
            [...heroImages()].map(async (src) => {
              // "/gallery/Ecole/a.jpg" -> public id "gallery/Ecole/a"
              const id = src.slice(1).replace(/\.\w+$/, '')
              const thumb = await fetch(
                `https://res.cloudinary.com/${cloud}/image/upload/w_32,e_blur:200,q_auto:low,f_webp/${id}`,
              )
              if (!thumb.ok) throw new Error(`${src}: Cloudinary ${thumb.status}`)
              const b64 = Buffer.from(await thumb.arrayBuffer()).toString('base64')
              return [src, `data:image/webp;base64,${b64}`]
            }),
          ),
        )
        writeFileSync('app/assets/gallery-placeholders.json', JSON.stringify(placeholders))
      } catch (e) {
        console.error(`Gallery module - Error while generating hero placeholders : ${e}`)
      }
    })
  },
})
