<script setup lang="ts">
import components from 'virtual:transient/components'
import schemas from 'virtual:transient/schemas'
import { ComponentEditor, type Rule } from '@transient/nuxt/editor'
import { type BindingValue, irToSfc, type TransientComponentSchema } from '@transient/nuxt/ir'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { navigateTo, useRoute, useRouter } from '#imports'
import { checkLogged, publishPage } from '~/api/api'
import ColorField from '~/editor/ColorField.vue'
import DateField from '~/editor/DateField.vue'
import PageExplorer from '~/editor/PageExplorer.vue'
import PhotoField from '~/editor/PhotoField.vue'
import SeoField from '~/editor/SeoField.vue'

useSeoMeta({ robots: 'noindex, nofollow' })

// /edit?page=a → /edit?page=b only changes the query: remount the editor
definePageMeta({
  key: (route) => route.fullPath,
  async middleware() {
    if (import.meta.client && !(await checkLogged())) {
      return navigateTo('/admin')
    }
  },
})

const fields = [
  { component: 'Hero', prop: 'backgroundImage', use: PhotoField },
  { component: 'Hero', prop: 'seo', use: SeoField },
  { component: 'NewsHero', prop: 'date', use: DateField },
  { component: 'NewsHero', prop: 'color', use: ColorField },
  { component: 'NewsHero', prop: 'updated', use: DateField },
  { component: 'NewsHero', prop: 'image', use: PhotoField },
  { component: 'NewsHero', prop: 'seo', use: SeoField },
  { component: 'TextBlock', prop: 'highlightColor', use: ColorField },
  { component: 'TextMedia', prop: 'media', use: PhotoField },
  { component: 'PhotoCarousel', prop: 'images', use: PhotoField },
  { component: 'PhotoBanner', prop: 'photo', use: PhotoField },
  { component: 'Image', prop: 'image', use: PhotoField },
]

const title = useRoute().query.title
const prefilled = useRoute().query.prefilled
  ? JSON.parse(useRoute().query.prefilled as string)
  : null
const page = String(useRoute().query.page ?? 'index')
const content = useRoute().query.content?.toString()

const component = ref(structuredClone(schemas[content ?? page]))

if (prefilled) {
  const hero =
    content &&
    component.value?.template.elements.find((el) => el.tag === 'NewsHero' || el.tag === 'Hero')

  if (hero) {
    for (const [key, value] of Object.entries(prefilled)) {
      hero.attributes[key] = {
        type: 'literal',
        expression: value as BindingValue,
      }
    }
  }
}

// internal links open the linked page in the editor instead of the site.
// While editing, a click edits the link: cmd/ctrl + click follows it.
const router = useRouter()
function followLink(ev: MouseEvent) {
  const link = (ev.target as Element | null)?.closest?.('a[href]')
  if (!link) return

  const editing = link.closest('[data-test="canvas"]')
  if (editing && !ev.metaKey && !ev.ctrlKey) {
    ev.preventDefault()
    return
  }

  const target = router.resolve(link.getAttribute('href')!)
  const name = String(target.name ?? '')
  if (!(name in schemas)) return // external link or not an editable page

  ev.preventDefault()
  const dirty = JSON.stringify(component.value) !== JSON.stringify(schemas[page])
  if (dirty && !confirm('Les modifications non publiées seront perdues. Continuer ?')) return
  navigateTo({ path: '/edit', query: { page: name }, hash: target.hash })
}
// capture: runs before NuxtLink's own click handler, which skips prevented events
onMounted(() => document.addEventListener('click', followLink, true))
onBeforeUnmount(() => document.removeEventListener('click', followLink, true))

const toast = ref<{ success: boolean; message: string } | null>(null)

const editor = useTemplateRef('editor')

async function publish(component: TransientComponentSchema) {
  const { err } = await publishPage(page, irToSfc(component, schemas))
  if (err) {
    toast.value = {
      success: false,
      message:
        "La publication a échoué : les modifications ne sont pas en ligne. Si l'erreur persiste, contactez Dodo :).",
    }
  } else {
    toast.value = {
      success: true,
      message: 'Publication réussie. Les modifications seront en ligne dans quelques minutes !',
    }
    editor.value?.markAsSaved()
  }
}
const rules: Rule[] = [
  {
    select: ':path("**/*/components/blocks/**/*")',
    can: 'add-component',
  },
  {
    select: 'Hero:first-child',
    cannot: ['move-element', 'delete-element'],
  },
  {
    select: 'NewsHero:first-child',
    cannot: ['move-element', 'delete-element'],
  },
]
const pageExplorerIsOpen = ref(false)

function editPage(slug: string) {
  const dirty = JSON.stringify(component.value) !== JSON.stringify(schemas[page])
  if (dirty && !confirm('Les modifications non publiées seront perdues. Continuer ?')) return
  navigateTo({ path: '/edit', query: { page: slug } })
}
</script>

<template>
  <PageExplorer
    v-if="pageExplorerIsOpen"
    @close="pageExplorerIsOpen = false"
    @edit="editPage"
    @add="(slug, title, prefilled) => {
      navigateTo({ path: '/edit', query: { page: slug, title, content: slug.includes('news') ? 'NewsPlaceholder' :'PagePlaceholder', prefilled: prefilled ? JSON.stringify(prefilled) : null} })
    }"
  />
  <button type="button" class="button editor__pages" @click="pageExplorerIsOpen = true">
    Voir toutes les pages
  </button>
  <p v-if="!component">Unknown page "{{ page }}"</p>
  <ComponentEditor
    v-else
    ref="editor"
    :fields="fields"
    @publish="publish"
    v-model="component"
    :dictionnary="schemas"
    :components="components"
    :rules="rules"
  />
  <Toast v-model="toast" />
</template>

<style lang="scss">
.editor{
  &__pages{
    position: fixed;
    top:0;
    left: 0;
    margin: 10px;
    z-index: 1000;
  }
}
</style>
