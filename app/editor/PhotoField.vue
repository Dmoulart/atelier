<!-- Custom editor field: picks one photo (string prop) or several (list prop) in the Cloudinary gallery -->
<template>
  <div class="photo-field">
    <button :id="id" type="button" class="photo-field__trigger" @click="open">
      <span
        v-if="current.length"
        class="photo-field__thumbs"
        :data-count="Math.min(current.length, 4)"
      >
        <img v-for="{ src } in current.slice(0, 4)" :key="src" :src="thumbnail(src)" alt="">
        <span v-if="current.length > 4" class="photo-field__more">+{{ current.length - 4 }}</span>
      </span>
      <span v-else class="photo-field__empty">Aucune photo</span>
      <span class="photo-field__label">
        {{ current.length ? 'Changer' : 'Choisir' }}
        {{ multiple ? 'les photos' : 'la photo' }}
      </span>
    </button>

    <!-- esc: closes the dialog, it must not reach the editor which would close its panel too -->
    <dialog
      ref="dialog"
      class="photo-dialog"
      aria-labelledby="photo-dialog-title"
      @keydown.esc.stop
      @click.self="dialog?.close()"
    >
      <aside class="photo-dialog__side">
        <h2 id="photo-dialog-title">Photothèque</h2>

        <label class="photo-import" :class="{ 'is-dragging': dragging }">
          <input type="file" accept="image/*" multiple @change="onFileInput">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 16V4m0 0L7 9m5-5 5 5M4 20h16" />
          </svg>
          <strong>Importer des photos</strong>
          <small>ou glissez-les ici · 10 Mo max</small>
        </label>

        <nav class="photo-dialog__folders" aria-label="Dossiers">
          <button
            v-for="name in ['', ...folders]"
            :key="name"
            type="button"
            :aria-pressed="folder === name"
            @click="folder = name"
          >
            <span class="photo-dialog__folder-name">{{ folderLabel(name) }}</span>
            <span v-if="pickedCount(name)" class="photo-dialog__pill">
              {{ pickedCount(name) }}<span class="is-sr-only"> sélectionnée(s)</span>
            </span>
          </button>
        </nav>

        <form class="photo-dialog__new-folder" @submit.prevent="createFolder">
          <input
            v-model="newFolder"
            type="text"
            placeholder="Nouveau dossier"
            aria-label="Nom du dossier"
          >
          <button type="submit" aria-label="Créer le dossier" :disabled="!folderSlug(newFolder)">
            +
          </button>
        </form>
      </aside>

      <div class="photo-dialog__main">
        <header class="photo-dialog__header">
          <h3>{{ folderLabel(folder) }}</h3>
          <span>{{ visible.length }} {{ visible.length > 1 ? 'photos' : 'photo' }}</span>
          <button
            v-if="multiple && visible.length"
            type="button"
            class="photo-dialog__select-all"
            @click="toggleAll"
          >
            {{ allPicked ? 'Tout désélectionner' : 'Tout sélectionner' }}
          </button>
          <button type="button" aria-label="Fermer" @click="dialog?.close()">×</button>
        </header>

        <div v-if="error" class="photo-dialog__error" role="alert">
          {{ error }}
          <button v-if="!photos.length" type="button" @click="load">Réessayer</button>
        </div>

        <section
          class="photo-dialog__body"
          :class="{ 'is-dragging': dragging }"
          aria-label="Photos"
          @dragover.prevent="dragging = true"
          @dragleave="onDragLeave"
          @drop.prevent="onDrop"
        >
          <ul v-if="loading" class="photo-dialog__grid" aria-hidden="true">
            <li v-for="i in 12" :key="i" class="photo-dialog__skeleton" />
          </ul>

          <p v-else-if="!visible.length && !error" class="photo-dialog__placeholder">
            Ce dossier est vide : importez une photo pour le créer.
          </p>

          <ul v-else class="photo-dialog__grid">
            <li
              v-for="src in visible"
              :key="src"
              class="photo-tile"
              :class="{ 'is-picked': isPicked(src) }"
            >
              <button
                type="button"
                class="photo-tile__select"
                :aria-pressed="isPicked(src)"
                :aria-label="`Choisir ${fileName(src)}`"
                @click="toggle(src)"
              >
                <img :src="thumbnail(src)" alt="" loading="lazy">
                <span class="photo-tile__name">{{ fileName(src) }}</span>
              </button>
              <span v-if="isPicked(src)" class="photo-tile__badge" aria-hidden="true">
                {{ multiple ? pickedIndex(src) + 1 : '✓' }}
              </span>
            </li>
          </ul>
        </section>

        <section v-if="uploads.length" class="photo-uploads" aria-label="Envois en cours">
          <header>
            <strong role="status">{{ uploadsSummary }}</strong>
            <button v-if="!uploading" type="button" aria-label="Masquer" @click="clearUploads">
              ×
            </button>
          </header>
          <ul>
            <li v-for="upload in uploads" :key="upload.id" :class="`is-${upload.status}`">
              <img :src="upload.preview" alt="">
              <span class="photo-uploads__name">{{ upload.name }}</span>
              <progress v-if="upload.status === 'sending'" :value="upload.progress" max="1" />
              <span v-else class="photo-uploads__status">{{ upload.message }}</span>
            </li>
          </ul>
        </section>

        <footer v-if="multiple" class="photo-dialog__footer">
          <p>
            {{ picked.length }}
            {{ picked.length > 1 ? 'photos sélectionnées' : 'photo sélectionnée' }}
          </p>
          <button type="button" @click="confirmPicked">Valider la sélection</button>
        </footer>
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { getTypeKind, type TransientProp } from '@transient/nuxt/ir'

type Photo = { src: string; caption?: string }
type Upload = {
  id: number
  name: string
  preview: string
  progress: number
  status: 'waiting' | 'sending' | 'done' | 'error'
  message: string
}

const props = defineProps<{ id?: string; prop: TransientProp; modelValue?: unknown }>()
const emit = defineEmits<{ 'update:modelValue': [value: string | Photo[]] }>()

const MAX_SIZE = 10 * 1024 * 1024 // cloudinary free plan

const { BACK_URL } = useRuntimeConfig().public
const img = useImage()
const dialog = useTemplateRef('dialog')

const multiple = computed(() => getTypeKind(props.prop.type) === 'list')
const current = computed<Photo[]>(() => {
  const value = props.modelValue
  if (Array.isArray(value)) return value
  return typeof value === 'string' && value ? [{ src: value }] : []
})

const photos = ref<string[]>([])
const picked = ref<Photo[]>([])
const folder = ref('')
// a cloudinary folder only exists through its photos: a new one lives here until the first import
const newFolders = ref<string[]>([])
const newFolder = ref('')
const loading = ref(false)
const dragging = ref(false)
const uploads = ref<Upload[]>([])
let uploadId = 0
const error = ref('')

// "/gallery/Ecole/a.jpg" -> "Ecole", "/gallery/a.jpg" -> ""
const folderOf = (src: string) => src.split('/').slice(2, -1).join('/')
const folders = computed(() =>
  [...new Set([...photos.value.map(folderOf), ...newFolders.value])].filter(Boolean).sort(),
)
const visible = computed(() =>
  folder.value ? photos.value.filter((src) => folderOf(src) === folder.value) : photos.value,
)
const folderLabel = (name: string) =>
  name
    ? name.replace(/([a-z])([A-Z])/g, (_, end, start) => `${end} ${start.toLowerCase()}`)
    : 'Toutes'
const fileName = (src: string) =>
  src
    .split('/')
    .pop()
    ?.replace(/\.[^.]+$/, '') ?? src

const thumbnail = (src: string) => img(src, { width: 300, height: 300 })
// pages write "/gallery/a.jpg", "gallery/a.jpg" or "./gallery/a.jpg"
const samePhoto = (a: string, b: string) => a.replace(/^\.?\//, '') === b.replace(/^\.?\//, '')
const pickedIndex = (src: string) => picked.value.findIndex((photo) => samePhoto(photo.src, src))
const isPicked = (src: string) => pickedIndex(src) !== -1
// how many picked photos a folder holds, "" being all of them
const pickedCount = (name: string) =>
  name
    ? picked.value.filter(({ src }) => folderOf(`/${src.replace(/^\.?\//, '')}`) === name).length
    : picked.value.length

function media<T>(method: 'GET' | 'POST', body?: Record<string, string>) {
  return $fetch<T>(`${BACK_URL}/media`, { method, body })
}

async function attempt(action: () => Promise<void>, failure: string) {
  error.value = ''
  try {
    await action()
  } catch (e) {
    console.error(e)
    error.value = failure
  }
}

async function load() {
  loading.value = true
  await attempt(async () => {
    photos.value = (await media<{ photos: string[] }>('GET')).photos
  }, 'Impossible de charger les photos.')
  loading.value = false
}

function open() {
  picked.value = [...current.value]
  dialog.value?.showModal()
  load()
}

function toggle(src: string) {
  if (!multiple.value) {
    emit('update:modelValue', src)
    dialog.value?.close()
    return
  }
  picked.value = isPicked(src)
    ? picked.value.filter((photo) => !samePhoto(photo.src, src))
    : [...picked.value, { src }]
}

const allPicked = computed(() => visible.value.every(isPicked))

function toggleAll() {
  picked.value = allPicked.value
    ? picked.value.filter((photo) => !visible.value.some((src) => samePhoto(photo.src, src)))
    : [...picked.value, ...visible.value.filter((src) => !isPicked(src)).map((src) => ({ src }))]
}

// "Stages d'été" -> "StagesDEte", the convention of the existing folders
const folderSlug = (name: string) =>
  name
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .split(/[^a-zA-Z0-9]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')

function createFolder() {
  const name = folderSlug(newFolder.value)
  if (!name) return
  newFolders.value.push(name)
  folder.value = name
  newFolder.value = ''
}

function confirmPicked() {
  emit('update:modelValue', picked.value)
  dialog.value?.close()
}

function onFileInput(event: Event) {
  const input = event.target as HTMLInputElement
  upload([...(input.files ?? [])])
  input.value = ''
}

function onDrop(event: DragEvent) {
  dragging.value = false
  upload([...(event.dataTransfer?.files ?? [])].filter((file) => file.type.startsWith('image/')))
}

function onDragLeave(event: DragEvent) {
  const body = event.currentTarget as HTMLElement
  if (!body.contains(event.relatedTarget as Node | null)) dragging.value = false
}

const uploading = computed(() =>
  uploads.value.some(({ status }) => status === 'waiting' || status === 'sending'),
)
const uploadsSummary = computed(() => {
  const total = uploads.value.length
  const done = uploads.value.filter(({ status }) => status === 'done').length
  const failed = uploads.value.filter(({ status }) => status === 'error').length
  if (uploading.value) return `Envoi en cours : ${done + failed + 1} sur ${total}`
  if (failed) return `${done} importée${done > 1 ? 's' : ''}, ${failed} en échec`
  return `${done} photo${done > 1 ? 's' : ''} importée${done > 1 ? 's' : ''}`
})

function clearUploads() {
  for (const { preview } of uploads.value) URL.revokeObjectURL(preview)
  uploads.value = []
}

// xhr and not fetch: fetch can't report the progress of an upload
function send(url: string, form: FormData, onProgress: (progress: number) => void) {
  return new Promise<{ public_id: string; format: string }>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', url)
    xhr.responseType = 'json'
    xhr.upload.onprogress = (event) => onProgress(event.loaded / event.total)
    xhr.onload = () =>
      xhr.status < 300 ? resolve(xhr.response) : reject(new Error(xhr.response?.error?.message))
    xhr.onerror = () => reject(new Error('network error'))
    xhr.send(form)
  })
}

async function upload(files: File[]) {
  const target = folder.value
  const batch = files.map((file) => {
    const item = reactive<Upload>({
      id: uploadId++,
      name: file.name,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: 'waiting',
      message: 'En attente',
    })
    uploads.value.push(item)
    return { file, item }
  })

  // one at a time, and a failure doesn't stop the next ones
  for (const { file, item } of batch) {
    if (file.size > MAX_SIZE) {
      Object.assign(item, { status: 'error', message: 'Trop lourde (10 Mo max)' })
      continue
    }

    try {
      item.status = 'sending'
      const { url, fields } = await media<{ url: string; fields: Record<string, string> }>('POST', {
        filename: file.name,
        folder: target,
      })
      const form = new FormData()
      for (const [name, value] of Object.entries(fields)) form.set(name, value)
      form.set('file', file)

      // sent straight to cloudinary: the back never handles the file
      const { public_id, format } = await send(url, form, (progress) => {
        item.progress = progress
      })
      photos.value.unshift(`/${public_id}.${format}`)
      Object.assign(item, { status: 'done', message: 'Importée' })
    } catch (e) {
      console.error(e)
      Object.assign(item, { status: 'error', message: 'Échec de l’envoi' })
    }
  }
}
</script>

<style scoped lang="scss">
.photo-field,
.photo-dialog {
  --accent: #b4532a;
  --accent-soft: #fbeee7;
  --ink: #23201d;
  --muted: #6f6861;
  --line: #e7e2dc;
  --surface: #faf8f5;
  --danger: #b3261e;
}

button {
  font: inherit;
  cursor: pointer;
}

button:focus-visible,
label:has(input:focus-visible) {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.photo-field {
  &__trigger {
    display: block;
    width: 100%;
    padding: 0;
    overflow: hidden;
    color: var(--ink);
    text-align: left;
    background: #fff;
    border: 1px solid var(--line);
    border-radius: 0.5rem;
    transition: border-color 0.15s;

    &:hover {
      border-color: var(--accent);
    }
  }

  &__thumbs {
    position: relative;
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    gap: 2px;
    height: 7rem;

    img {
      width: 100%;
      height: 7rem;
      object-fit: cover;
    }
  }

  &__more {
    position: absolute;
    right: 0.375rem;
    bottom: 0.375rem;
    padding: 0 0.375rem;
    font-size: 0.75rem;
    color: #fff;
    background: rgba(0, 0, 0, 0.65);
    border-radius: 0.25rem;
  }

  &__empty {
    display: grid;
    place-items: center;
    height: 5rem;
    font-size: 0.8125rem;
    color: var(--muted);
    background: var(--surface);
  }

  &__label {
    display: block;
    padding: 0.375rem 0.625rem;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--ink);
  }
}

.photo-dialog {
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
    display: grid;
    grid-template-columns: 16rem minmax(0, 1fr);
  }

  &::backdrop {
    background: rgba(35, 32, 29, 0.6);
  }

  svg {
    fill: none;
    stroke: currentColor;
    stroke-width: 1.75;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  &__side {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    min-height: 0;
    padding: 1.5rem 1rem;
    background: var(--surface);
    border-right: 1px solid var(--line);

    h2 {
      padding: 0 0.5rem;
      font-size: 1.25rem;
      font-weight: 700;
    }
  }

  &__folders {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 0.125rem;
    min-height: 0;
    overflow-y: auto;

    button {
      display: flex;
      flex: none;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      padding: 0.5rem;
      font-size: 0.875rem;
      color: var(--muted);
      text-align: left;
      white-space: nowrap;
      background: none;
      border: 0;
      border-radius: 0.5rem;

      &:hover {
        color: var(--ink);
        background: var(--line);
      }

      &[aria-pressed='true'] {
        font-weight: 600;
        color: var(--accent);
        background: var(--accent-soft);
      }
    }
  }

  &__new-folder {
    display: flex;
    gap: 0.25rem;

    input {
      flex: 1;
      min-width: 0;
      padding: 0.375rem 0.5rem;
      font: inherit;
      font-size: 0.875rem;
      color: var(--ink);
      background: #fff;
      border: 1px solid var(--line);
      border-radius: 0.5rem;

      &:focus {
        border-color: var(--accent);
        outline: none;
      }
    }

    button {
      width: 2.125rem;
      font-size: 1.125rem;
      color: var(--accent);
      background: #fff;
      border: 1px solid var(--line);
      border-radius: 0.5rem;

      &:disabled {
        cursor: default;
        opacity: 0.4;
      }
    }
  }

  &__folder-name {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__pill {
    flex: none;
    min-width: 1.25rem;
    padding: 0 0.375rem;
    font-size: 0.75rem;
    font-weight: 700;
    line-height: 1.25rem;
    color: #fff;
    text-align: center;
    background: var(--accent);
    border-radius: 0.625rem;
  }

  &__main {
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
  }

  &__header {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    padding: 1.25rem 1rem 0.75rem 1.5rem;

    h3 {
      font-size: 1.125rem;
      font-weight: 600;
    }

    span {
      margin-right: auto;
      font-size: 0.8125rem;
      color: var(--muted);
    }

    button {
      width: 2.25rem;
      height: 2.25rem;
      font-size: 1.5rem;
      line-height: 1;
      color: var(--muted);
      background: none;
      border: 0;
      border-radius: 0.5rem;

      &:hover {
        color: var(--ink);
        background: var(--surface);
      }
    }
  }

  .photo-dialog__select-all {
    width: auto;
    height: auto;
    padding: 0.25rem 0.625rem;
    font-size: 0.8125rem;
    font-weight: 600;
    line-height: 1.5;
    color: var(--accent);
  }

  &__error {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin: 0 1.5rem 0.75rem;
    padding: 0.625rem 0.875rem;
    font-size: 0.875rem;
    color: var(--danger);
    background: #fdecea;
    border-radius: 0.5rem;

    button {
      font-weight: 600;
      color: inherit;
      text-decoration: underline;
      background: none;
      border: 0;
    }
  }

  &__body {
    flex: 1;
    min-height: 0;
    padding: 0.375rem 1.5rem 1.5rem;
    overflow-y: auto;

    &.is-dragging {
      background: var(--accent-soft);
      box-shadow: inset 0 0 0 2px var(--accent);
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
    gap: 0.75rem;
  }

  &__skeleton {
    aspect-ratio: 1;
    background: var(--line);
    border-radius: 0.625rem;
    animation: photo-pulse 1.2s ease-in-out infinite alternate;
  }

  &__placeholder {
    display: grid;
    place-items: center;
    height: 100%;
    color: var(--muted);
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
    color: var(--muted);
    border-top: 1px solid var(--line);

    button {
      padding: 0.5rem 1.25rem;
      font-weight: 600;
      color: #fff;
      background: var(--accent);
      border: 0;
      border-radius: 0.5rem;
    }
  }

  @media (max-width: 45rem) {
    &[open] {
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: auto minmax(0, 1fr);
    }

    &__side {
      gap: 0.75rem;
      padding: 1rem;
      border-right: 0;
      border-bottom: 1px solid var(--line);
    }

    &__folders {
      flex-direction: row;
      overflow-x: auto;
    }

    // no drag and drop on touch screens
    .photo-import {
      grid-auto-flow: column;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.625rem;

      svg {
        margin: 0;
      }

      small {
        display: none;
      }
    }

    &__grid {
      grid-template-columns: repeat(auto-fill, minmax(7rem, 1fr));
    }
  }
}

.photo-import {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 0.125rem;
  padding: 1rem 0.75rem;
  color: var(--accent);
  text-align: center;
  cursor: pointer;
  background: #fff;
  border: 1.5px dashed var(--accent);
  border-radius: 0.75rem;
  transition: background 0.15s;

  &:hover,
  &.is-dragging {
    background: var(--accent-soft);
  }

  input {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
    margin-bottom: 0.25rem;
  }

  strong {
    font-size: 0.875rem;
    color: inherit;
  }

  small {
    font-size: 0.75rem;
    color: var(--muted);
  }
}

.photo-uploads {
  padding: 0.625rem 1.5rem;
  font-size: 0.8125rem;
  background: var(--surface);
  border-top: 1px solid var(--line);

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 1.5rem;
    margin-bottom: 0.375rem;

    strong {
      color: var(--ink);
    }

    button {
      font-size: 1.125rem;
      line-height: 1;
      color: var(--muted);
      background: none;
      border: 0;
    }
  }

  ul {
    display: grid;
    gap: 0.25rem;
    max-height: 8.5rem;
    overflow-y: auto;
  }

  li {
    display: grid;
    grid-template-columns: 2rem minmax(0, 1fr) 10rem;
    align-items: center;
    gap: 0.625rem;
  }

  img {
    width: 2rem;
    height: 2rem;
    object-fit: cover;
    border-radius: 0.25rem;
  }

  progress {
    width: 100%;
    height: 0.375rem;
    accent-color: var(--accent);
  }

  &__name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__status {
    color: var(--muted);
    text-align: right;
  }

  .is-done .photo-uploads__status {
    color: #2e7d4f;
  }

  .is-error .photo-uploads__status {
    color: var(--danger);
  }
}

.photo-tile {
  position: relative;
  overflow: hidden;
  background: var(--line);
  border-radius: 0.625rem;

  &__select {
    display: block;
    width: 100%;
    padding: 0;
    background: none;
    border: 0;

    img {
      display: block;
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
      transition: transform 0.2s;
    }
  }

  &__name {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 1.25rem 0.5rem 0.375rem;
    overflow: hidden;
    font-size: 0.75rem;
    color: #fff;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
    opacity: 0;
    transition: opacity 0.15s;
  }

  &__badge {
    position: absolute;
    top: 0.375rem;
    left: 0.375rem;
    display: grid;
    place-items: center;
    width: 1.5rem;
    height: 1.5rem;
    font-size: 0.75rem;
    font-weight: 700;
    color: #fff;
    pointer-events: none;
    background: var(--accent);
    border-radius: 50%;
  }

  &:hover,
  &:focus-within {
    .photo-tile__name {
      opacity: 1;
    }
  }

  &:hover .photo-tile__select img {
    transform: scale(1.04);
  }

  &.is-picked {
    box-shadow:
      0 0 0 2px #fff,
      0 0 0 4px var(--accent);
  }
}

@keyframes photo-pulse {
  to {
    opacity: 0.45;
  }
}

@media (prefers-reduced-motion: reduce) {
  .photo-dialog__skeleton {
    animation: none;
  }

  .photo-tile__select img {
    transition: none;
  }
}
</style>
