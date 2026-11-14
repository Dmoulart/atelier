<template>
  <dialog class="page-explorer" ref="dialog">
    <header class="page-explorer__header">
      <h3>Mes pages</h3>
      <button type="button" aria-label="Fermer" @click="$emit('close')">×</button>
    </header>
    <div class="page-explorer__content">
      <div class="page-explorer__row" v-for="(pages, path) in pagesByPath">
        <h3>{{ path }}</h3>
        <div class="page-explorer__list">
          <ComponentItem
            v-for="({ name, schema }) in pages"
            :component="components[name]"
            :dictionnary="schemas"
            :schema="schema"
            class="page-explorer__item"
          />
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import components from 'virtual:transient/components'
import schemas from 'virtual:transient/schemas'
import { ComponentItem } from '@transient/nuxt/editor'
import type { TransientComponentSchema } from '@transient/nuxt/ir'

let originalParentOverflow: string = ''

const pagesByPath = computed<
  Record<string, { name: string; schema: TransientComponentSchema; slug: string }[]>
>(() => {
  const pages = Object.entries(schemas)
    .map(([name, schema]) => {
      if (schema.path.endsWith('/admin.vue') || schema.path.endsWith('/edit.vue')) {
        return null
      }
      const result = /.*\/pages\/(?<slug>.*)\.vue/.exec(schema.path)

      if (!result?.groups?.slug) return null

      let slug = result.groups.slug
      slug = `/${slug.replace('index', '')}`

      return { name, schema, slug }
    })
    .filter(Boolean) as { name: string; schema: TransientComponentSchema; slug: string }[]

  const pagesByPath = Object.groupBy(pages, (item) => {
    const path = /\/(?<path>.*)\//.exec(item.slug)?.groups?.path ?? ''
    return path
  }) as Record<
    string,
    {
      name: string
      schema: TransientComponentSchema
      slug: string
    }[]
  >

  return pagesByPath
})
onMounted(() => {
  originalParentOverflow = document.documentElement.style.overflowY
  document.documentElement.style.overflowY = 'hidden'
})

onUnmounted(() => {
  document.documentElement.style.overflowY = originalParentOverflow
})
</script>
<style lang="scss">
.page-explorer {
  --accent: #b4532a;
  --accent-soft: #fbeee7;
  --ink: #23201d;
  --muted: #6f6861;
  --line: #e7e2dc;
  --surface: #faf8f5;
  --danger: #b3261e;
  position:fixed;
  display: flex;
  flex-direction: column;
  gap: 12px;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  z-index: 10000;
  margin: auto;
  background: var(--surface);

  width: min(70rem, calc(100vw - 2rem));
  height: min(48rem, calc(100vh - 2rem));
  padding: 12px;
  color: var(--ink);
  background: #fff;
  border: 0;
  border-radius: 1rem;
  box-shadow: 0 2rem 5rem rgba(35, 32, 29, 0.35);

 &__header {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    width:100%;
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
      margin-left:auto;

      &:hover {
        color: var(--ink);
        background: var(--surface);
      }
    }
  }
  &__content{
    display:flex;
    overflow: scroll;
    flex-direction: column;
    height: 100%;
    padding: 8px;
    gap:12px;
  }
  &__item{
    height: 260px;
    width: 260px;

    .tr-card-thumb{
      height: 100%;
    }
  }

  &__row{
    display:flex;
    flex-direction: column;
    padding: 8px;
    gap:12px;
  }

  &__list{
    display:flex;
    flex-wrap:wrap;
    flex-direction: row;
    padding: 8px;
    gap:12px;
  }
}
</style>
