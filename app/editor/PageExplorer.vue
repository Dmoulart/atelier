<template>
  <dialog
    ref="dialog"
    class="page-explorer"
    aria-labelledby="page-explorer-title"
    @close="$emit('close')"
    @cancel="onCancel"
    @keydown.esc.stop
    @click.self="dialog?.close()"
  >
    <header class="page-explorer__header">
      <button
        v-if="adding !== null"
        type="button"
        class="page-explorer__back"
        aria-label="Retour aux pages"
        @click="adding = null"
      >
        ←
      </button>
      <h2 id="page-explorer-title">
        {{ adding === null ? 'Mes pages' : addLabel(adding) }}
      </h2>
      <span>{{ adding === null ? `${count} ${count > 1 ? 'pages' : 'page'}` : '' }}</span>
      <button type="button" aria-label="Fermer" @click="dialog?.close()">×</button>
    </header>

    <form v-if="adding !== null" class="page-explorer__form" @submit.prevent="create">
      <!-- the full width scroller keeps the scrollbar on the dialog's edge, __new centers the fields -->
      <div class="page-explorer__content page-explorer__content--form">
        <div class="page-explorer__new">
          <label for="page-explorer-name">Nom de la page</label>
          <input
            id="page-explorer-name"
            v-model="name"
            type="text"
            placeholder="Ex : Stage d'été 2027"
            autocomplete="off"
            autofocus
            :aria-invalid="!!error"
            aria-describedby="page-explorer-url page-explorer-error"
          >

          <p id="page-explorer-url" class="page-explorer__url">
            <span>Adresse de la page</span>
            <output>
              {{ host }}/{{ adding ? `${adding}/` : '' }}<strong>{{ slug || '…' }}</strong>/
            </output>
          </p>

          <p v-if="error" id="page-explorer-error" class="page-explorer__error" role="alert">
            {{ error }}
          </p>

          <fieldset class="page-explorer__prefill">
            <legend><span>(facultatif, modifiable ensuite)</span></legend>
            <div class="page-explorer__photo">
              <label :for="`${id}-image`">Photo principale</label>
              <PhotoField
                :id="`${id}-image`"
                :prop="hero.props[heroImage]!"
                mode="fill"
                :model-value="prefilled[heroImage]"
                @update:model-value="prefilled[heroImage] = $event"
              />
            </div>
            <SeoField
              :prop="hero.props.seo!"
              :model-value="prefilled.seo as Record<string, string | undefined>"
              @update:model-value="prefilled.seo = $event"
            />
          </fieldset>
        </div>
      </div>

      <div class="page-explorer__actions">
        <button type="button" @click="adding = null">Annuler</button>
        <button type="submit" :disabled="!!error || !slug">Créer la page</button>
      </div>
    </form>

    <div v-else class="page-explorer__content">
      <section
        v-for="(pages, path) in pagesByPath"
        :key="path"
        class="page-explorer__group"
        :aria-label="groupLabel(path)"
      >
        <h3>{{ groupLabel(path) }}</h3>
        <ul class="page-explorer__grid">
          <li v-for="{ name, schema, slug } in pages" :key="name" class="page-explorer__item">
            <ComponentItem
              :component="components[name]"
              :dictionnary="schemas"
              :schema="schema"
              @select="$emit('edit', name)"
            />
            <span class="page-explorer__slug">{{ slug }}</span>
            <!-- out of the tab order: the card itself edits the page from the keyboard -->
            <button
              type="button"
              class="page-explorer__edit"
              tabindex="-1"
              :aria-label="`Éditer la page ${slug}`"
              @click="$emit('edit', name)"
            >
              Éditer
            </button>
          </li>
          <li>
            <button type="button" class="page-explorer__add" @click="startAdding(path)">
              <span aria-hidden="true">+</span>
              {{ addLabel(path) }}
            </button>
          </li>
        </ul>
      </section>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import components from 'virtual:transient/components'
import schemas from 'virtual:transient/schemas'
import { ComponentItem } from '@transient/nuxt/editor'
import type { TransientComponentSchema } from '@transient/nuxt/ir'
import PhotoField from './PhotoField.vue'
import SeoField from './SeoField.vue'

// edit: the page's schema name
// add: the new page's file path under app/pages, without .vue ("news/mon-article"), its name,
// and the attributes picked for its hero, by prop name: { title?, image | backgroundImage, seo }
const emit = defineEmits<{
  close: []
  edit: [name: string]
  add: [path: string, title: string, prefilled: Record<string, unknown> | null]
}>()

type Page = { name: string; schema: TransientComponentSchema; slug: string }

const dialog = useTemplateRef('dialog')
onMounted(() => dialog.value?.showModal())

const pages = computed(() =>
  Object.entries(schemas)
    .map(([name, schema]) => {
      if (schema.path.endsWith('/admin.vue') || schema.path.endsWith('/edit.vue')) {
        return null
      }
      const slug = /.*\/pages\/(?<slug>.*)\.vue/.exec(schema.path)?.groups?.slug
      if (!slug) return null

      return { name, schema, slug: `/${slug.replace('index', '')}` }
    })
    .filter((page): page is Page => page !== null),
)

const count = computed(() => pages.value.length)

const pagesByPath = computed(() => {
  const byPath = Object.groupBy(
    pages.value,
    (page) => /\/(?<path>.*)\//.exec(page.slug)?.groups?.path ?? '',
  ) as Record<string, Page[]>

  if (!('news' in byPath)) {
    byPath.news = []
  }
  return byPath
})

// "" -> "Pages", "news" -> "News"
const groupLabel = (path: string) => (path ? path.charAt(0).toUpperCase() + path.slice(1) : 'Pages')
const addLabel = (path: string) => (path ? `Nouvelle page ${groupLabel(path)}` : 'Nouvelle page')

// new page: the group it goes in, null while browsing the pages
const adding = ref<string | null>(null)
const name = ref('')
const prefilled = ref<Record<string, unknown>>({})
const id = useId()

// the hero the new page starts with, same choice as edit.vue's placeholders
const hero = computed(() => schemas[adding.value === 'news' ? 'NewsHero' : 'Hero']!)
const heroImage = computed(() => (adding.value === 'news' ? 'image' : 'backgroundImage'))

// emptied fields are left out: "" would overwrite the placeholder's text with nothing
function filled(value: unknown): unknown {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const entries = Object.entries(value).filter(([, v]) => filled(v) !== undefined)
    return entries.length ? Object.fromEntries(entries) : undefined
  }
  return value === '' || value == null ? undefined : value
}

// esc on the new page form goes back to the pages, it only closes the dialog from the pages
function onCancel(event: Event) {
  if (adding.value === null) return
  event.preventDefault()
  adding.value = null
}

function startAdding(path: string) {
  name.value = ''
  prefilled.value = {}
  adding.value = path
}

const host = new URL(useRuntimeConfig().public.BASE_URL).host

// "Stage d'été 2027 !" -> "stage-d-ete-2027": the back only accepts [a-z0-9-]
const slugify = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/œ/gi, 'oe')
    .replace(/æ/gi, 'ae')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const slug = computed(() => slugify(name.value))

// "/art-therapie", "/news/foo"… plus what a new page can't take over: the editor's own pages,
// the home, and at the root the name of a folder (news.vue would wrap every news page)
const taken = computed(
  () =>
    new Set([
      ...pages.value.map((page) => page.slug.replace(/\/$/, '')),
      ...['admin', 'edit', 'index'].map((reserved) => `/${reserved}`),
      ...Object.keys(pagesByPath.value).map((path) => `/${path}`),
    ]),
)

const error = computed(() => {
  if (!name.value.trim()) return ''
  if (!slug.value) return 'Le nom doit contenir au moins une lettre ou un chiffre.'
  const url = `/${adding.value ? `${adding.value}/` : ''}${slug.value}`
  return taken.value.has(url) ? 'Cette adresse est déjà utilisée par une autre page.' : ''
})

function create() {
  if (error.value || !slug.value || adding.value === null) return
  emit(
    'add',
    adding.value ? `${adding.value}/${slug.value}` : slug.value,
    name.value.trim(),
    (filled({
      ...prefilled.value,
      // the page's name is the hero's title, when it has one (NewsHero; Hero's h1 is in its slot)
      ...('title' in hero.value.props && { title: name.value.trim() }),
    }) as Record<string, unknown> | undefined) ?? null,
  )
}
</script>

<style lang="scss">
// the page behind the modal doesn't scroll
html:has(.page-explorer[open]) {
  overflow: hidden;
}

.page-explorer {
  --accent: #b4532a;
  --accent-soft: #fbeee7;
  --ink: #23201d;
  --muted: #6f6861;
  --line: #e7e2dc;
  --surface: #faf8f5;
  --danger: #b3261e;

  width: min(70rem, calc(100vw - 2rem));
  height: min(48rem, calc(100vh - 2rem));
  padding: 0;
  overflow: hidden;
  color: var(--ink);
  background: #fff;
  border: 0;
  border-radius: 1rem;
  box-shadow: 0 2rem 5rem rgba(35, 32, 29, 0.35);

  // not on the closed dialog: it would stay visible
  &[open] {
    display: flex;
    flex-direction: column;
  }

  &::backdrop {
    background: rgba(35, 32, 29, 0.6);
  }

  button:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  &__header {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    padding: 1.25rem 1rem 1rem 1.5rem;
    border-bottom: 1px solid var(--line);

    h2 {
      font-size: 1.25rem;
      font-weight: 700;
    }

    span {
      margin-right: auto;
      font-size: 0.8125rem;
      color: var(--muted);
    }

    button {
      align-self: center;
      width: 2.25rem;
      height: 2.25rem;
      font: inherit;
      font-size: 1.5rem;
      line-height: 1;
      color: var(--muted);
      cursor: pointer;
      background: none;
      border: 0;
      border-radius: 0.5rem;

      &:hover {
        color: var(--ink);
        background: var(--surface);
      }
    }
  }

  &__content {
    flex: 1;
    min-height: 0;
    padding: 1.25rem 1.5rem 1.5rem;
    overflow-y: auto;
    background: var(--surface);

    &--form {
      padding: 2rem 1.5rem;
      background: #fff;
    }
  }

  // header, scrolling fields, actions: the actions stay in view
  &__form {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
  }

  &__group + &__group {
    margin-top: 2rem;
  }

  &__group h3 {
    margin-bottom: 0.75rem;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
    gap: 1rem;
  }

  &__item {
    position: relative;

    .tr-card {
      height: 100%;
      background: #fff;
      transition:
        box-shadow 0.15s,
        transform 0.15s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 0.75rem 1.5rem rgba(35, 32, 29, 0.12);
      }
    }

    .tr-card-thumb {
      height: auto;
      aspect-ratio: 4 / 3;
    }

    .tr-card-name {
      font-weight: 600;
    }
  }

  // the url, over the preview
  &__slug {
    position: absolute;
    top: 0.75rem;
    left: 0.75rem;
    max-width: calc(100% - 1.5rem);
    padding: 0.125rem 0.5rem;
    overflow: hidden;
    font-family: ui-monospace, monospace;
    font-size: 0.75rem;
    color: #fff;
    text-overflow: ellipsis;
    white-space: nowrap;
    pointer-events: none;
    background: rgba(35, 32, 29, 0.7);
    border-radius: 0.375rem;
    backdrop-filter: blur(4px);
  }

  &__edit {
    position: absolute;
    top: 0.625rem;
    right: 0.625rem;
    padding: 0.25rem 0.75rem;
    font: inherit;
    font-size: 0.8125rem;
    font-weight: 600;
    color: #fff;
    cursor: pointer;
    background: var(--accent);
    border: 0;
    border-radius: 0.5rem;
    box-shadow: 0 0.25rem 0.75rem rgba(35, 32, 29, 0.25);
    transition: background 0.15s;

    &:hover {
      background: #9a4522;
    }
  }

  &__add {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    width: 100%;
    height: 100%;
    min-height: 12rem;
    font: inherit;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--accent);
    cursor: pointer;
    background: transparent;
    border: 1.5px dashed var(--accent);
    border-radius: 10px;
    transition: background 0.15s;

    span {
      font-size: 2rem;
      font-weight: 400;
      line-height: 1;
    }

    &:hover {
      background: var(--accent-soft);
    }
  }

  &__header .page-explorer__back {
    margin-right: -0.25rem;
    margin-left: -0.5rem;
    font-size: 1.25rem;
  }

  &__new {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: min(52rem, 100%);
    margin: 0 auto;

    label {
      font-size: 0.875rem;
      font-weight: 600;
    }

    input {
      padding: 0.75rem 1rem;
      font: inherit;
      color: var(--ink);
      background: #fff;
      border: 1px solid var(--line);
      border-radius: 0.5rem;
      transition:
        border-color 0.15s,
        box-shadow 0.15s;

      &:focus {
        border-color: var(--accent);
        outline: none;
        box-shadow: 0 0 0 3px var(--accent-soft);
      }

      &[aria-invalid='true'] {
        border-color: var(--danger);
        box-shadow: 0 0 0 3px #fdecea;
      }
    }
  }

  // photo on the left at a fixed width and as tall as the seo texts, which get the rest of the width
  &__prefill {
    display: grid;
    grid-template-columns: 16rem 1fr;
    gap: 1.5rem;
    margin: 1rem 0 0;
    padding: 1rem 1.25rem 1.25rem;
    border: 1px solid var(--line);
    border-radius: 0.5rem;

    legend {
      padding: 0 0.25rem;
      font-size: 0.875rem;
      font-weight: 600;

      span {
        font-weight: 400;
        color: var(--muted);
      }
    }

  }

  // label, then the PhotoField in fill mode on the remaining height
  &__photo {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    .photo-field {
      flex: 1;
      min-height: 0;
    }
  }

  &__url {
    display: grid;
    gap: 0.25rem;
    margin-top: 0.75rem;
    padding: 0.75rem 1rem;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 0.5rem;

    span {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    output {
      font-family: ui-monospace, monospace;
      font-size: 0.875rem;
      color: var(--muted);
      overflow-wrap: anywhere;
    }

    strong {
      color: var(--accent);
    }
  }

  &__error {
    padding: 0.5rem 0.875rem;
    font-size: 0.875rem;
    color: var(--danger);
    background: #fdecea;
    border-radius: 0.5rem;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-top: 1px solid var(--line);

    button {
      padding: 0.625rem 1.25rem;
      font: inherit;
      font-weight: 600;
      color: var(--muted);
      cursor: pointer;
      background: none;
      border: 0;
      border-radius: 0.5rem;

      &:hover {
        color: var(--ink);
        background: var(--surface);
      }
    }

    [type='submit'] {
      color: #fff;
      background: var(--accent);

      &:hover {
        color: #fff;
        background: #9a4522;
      }

      &:disabled {
        cursor: not-allowed;
        opacity: 0.45;

        &:hover {
          background: var(--accent);
        }
      }
    }
  }

  @media (max-width: 45rem) {
    &__content {
      padding: 1rem;
    }

    &__prefill {
      grid-template-columns: 1fr;
    }

    &__grid {
      grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
      gap: 0.75rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &__item .tr-card {
      transition: none;

      &:hover {
        transform: none;
      }
    }
  }
}
</style>
