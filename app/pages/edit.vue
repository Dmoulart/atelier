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

const toast = ref<{ success: boolean; message: string } | null>(null)
let toastTimer: ReturnType<typeof setTimeout> | undefined
onBeforeUnmount(() => clearTimeout(toastTimer))
const editor = useTemplateRef('editor')
function showToast(success: boolean, message: string) {
  clearTimeout(toastTimer)
  toast.value = { success, message }
  // an error stays until it is closed, it must not be missed
  if (success) toastTimer = setTimeout(() => (toast.value = null), 8000)
}

async function publish(component: TransientComponentSchema) {
  const config = useRuntimeConfig()
  const url = `${config.public.BACK_URL}/${component.tag}`

  try {
    const sfc = irToSfc(component, schemas)
    const result = await $fetch<{ message: string; success: boolean }>(url, {
      body: sfc,
      method: 'PUT',
    })
    if (!result.success) throw new Error(result.message)

    showToast(
      true,
      'Publication réussie. Les modifications seront en ligne dans quelques minutes !',
    )
    editor.value?.markAsSaved()
  } catch (e) {
    console.error(e)
    showToast(
      false,
      "La publication a échoué : les modifications ne sont pas en ligne. Si l'erreur persiste, contactez Dodo :).",
    )
  }
}
</script>

<template>
  <p v-if="!component">Unknown page "{{ page }}"</p>
  <ComponentEditor
    v-else
    ref="editor"
    @publish="publish"
    v-model="component"
    :dictionnary="schemas"
    :components="components"
  />
  <div
    v-if="toast"
    class="notification publish-toast"
    :class="toast.success ? 'is-success' : 'is-danger'"
    role="alert"
  >
    <button type="button" class="delete" aria-label="Fermer" @click="toast = null" />
    {{ toast.message }}
  </div>
</template>

<style scoped>
.publish-toast {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 9999;
  max-width: min(28rem, calc(100vw - 2rem));
}
</style>
