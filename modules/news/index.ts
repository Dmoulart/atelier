import { globSync, readFileSync } from 'node:fs'
import { addTemplate, defineNuxtModule } from '@nuxt/kit'
import { analyzeTemplateSource } from '@transient/nuxt/analyzer'

/**
 * Writes the blur placeholders of the heroes' background images at build time:
 * Cloudinary does the blur, we only inline the tiny result as a data URI.
 */
export default defineNuxtModule({
  setup(_options, nuxt) {
    addTemplate({
      filename: 'news.json',
      getContents: () => {
        const news = globSync('app/pages/news/*.vue', { cwd: nuxt.options.rootDir }).map((file) => {
          const { elements } = analyzeTemplateSource(readFileSync(file, 'utf-8'), {})
          const hero = elements.find((el) => el.tag === 'NewsHero')
          const attr = (name: string) => hero?.attributes[name]?.expression
          return { title: attr('title'), date: attr('date'), seo: attr('seo') }
        })
        return JSON.stringify(news)
      },
    })
  },
})
