<script setup lang="ts">
import components from 'virtual:transient/components'
import schemas from 'virtual:transient/schemas'
import { ComponentEditor } from '@transient/nuxt/editor'
import { irToSfc, type TransientComponentSchema } from '@transient/nuxt/ir'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { navigateTo, useRoute, useRouter } from '#imports'

// /edit?page=a → /edit?page=b only changes the query: remount the editor
definePageMeta({ key: (route) => route.fullPath })

const page = String(useRoute().query.page ?? 'index')
const component = ref(structuredClone(schemas[page]))

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

async function publish(component: TransientComponentSchema) {
  const config = useRuntimeConfig()

  const url = `${config.public.BACK_URL}/${component.tag}`
  const sfc = irToSfc(component, schemas)

  const result = await $fetch<{ message: string; success: boolean }>(url, {
    body: sfc,
    method: 'PUT',
  })

  if (!result.success) {
    console.error(result.message)
  }
  console.log({ result })
}
</script>

<template>
  <p v-if="!component">Unknown page "{{ page }}"</p>
  <ComponentEditor
    v-else
    @publish="publish"
    v-model="component"
    :dictionnary="schemas"
    :components="components"
  />
</template>
