import { globSync, readFileSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import { addTemplate, defineNuxtModule, updateTemplates } from '@nuxt/kit'
import { analyzeTemplateSource } from '@transient/nuxt/analyzer'

/**
 * Lists the news pages' NewsHero at build time, newest first, in #build/news.json:
 * the News block shows the latest without bundling every page.
 */
export default defineNuxtModule({
  setup(_options, nuxt) {
    const dir = resolve(nuxt.options.rootDir, 'app/pages/news')

    const template = addTemplate({
      filename: 'news.json',
      getContents: () => {
        const news = globSync('*.vue', { cwd: dir })
          .filter((file) => file !== 'index.vue')
          .flatMap((file) => {
            const { elements } = analyzeTemplateSource(readFileSync(resolve(dir, file), 'utf-8'), {})
            const hero = elements.find((el) => el.tag === 'NewsHero')
            if (!hero) return []
            const attr = (name: string) => hero.attributes[name]?.expression
            return {
              // Nuxt's route name for pages/news/<file>.vue, also the editor's ?page=
              name: `news-${basename(file, '.vue')}`,
              // the host serves every page with a trailing slash
              path: `/news/${basename(file, '.vue')}/`,
              image: attr('image'),
              color: attr('color'),
              title: attr('title'),
              date: attr('date'),
              seo: attr('seo'),
            }
          })
          // "YYYY-MM-DD" sorts as text
          .sort((a, b) => String(b.date ?? '').localeCompare(String(a.date ?? '')))
        return JSON.stringify(news)
      },
    })

    // dev: an added, edited or deleted article updates the list
    // the path is relative to srcDir or rootDir depending on Nuxt's version: match its end only
    nuxt.hook('builder:watch', async (_event, path) => {
      if (/(^|\/)pages\/news\/[^/]+\.vue$/.test(path)) {
        await updateTemplates({ filter: (t) => t.filename === template.filename })
      }
    })
  },
})
