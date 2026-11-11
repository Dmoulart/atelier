<!-- A titled text. `highlight` turns it into a centered callout on a tinted background. -->
<template>
  <Content
    class="text-block"
    :class="{ 'text-block--highlight': highlight }"
    :align="highlight ? 'center' : undefined"
  >
    <!-- never an h1: the page title belongs to the Hero -->
    <template v-if="title">
      <h3 v-if="titleSize === 'small'" class="has-text-centered">{{ title }}</h3>
      <h2 v-else class="has-text-centered">{{ title }}</h2>
    </template>
    <slot />
    <p v-if="linkLabel && linkUrl" class="has-text-centered is-size-4 mt-3">
      <a :href="linkUrl">{{ linkLabel }}</a>
    </p>
  </Content>
</template>
<script setup lang="ts">
const { titleSize = 'large' } = defineProps<{
  title?: string
  titleSize?: 'large' | 'small'
  highlight?: boolean
  linkLabel?: string
  linkUrl?: string
}>()
</script>
<style lang="scss">
.text-block--highlight {
  background: aliceblue;
  margin-block: 3rem;
}

// consecutive text blocks read as one group
section.text-block + section.text-block:not(.text-block--highlight),
section.photo-carousel + section.text-block:not(.text-block--highlight) {
  padding-top: 0;
}
section.text-block:not(.text-block--highlight):has(+ section.text-block:not(.text-block--highlight)) {
  padding-bottom: 0;
}
</style>
