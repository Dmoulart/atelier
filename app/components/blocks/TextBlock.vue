<template>
  <Content
    class="text-block"
    :class="{
      'text-block--highlight': background,
      'text-block--dark': background && !isLightColor(background),
    }"
    :style="{ background }"
    :align="background ? 'center' : undefined"
  >
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
const { titleSize = 'large', highlightColor } = defineProps<{
  title?: string
  titleSize?: 'large' | 'small'
  highlightColor?: string
  linkLabel?: string
  linkUrl?: string
}>()

const background = computed(() => highlightColor || undefined)
</script>
<style lang="scss">
.text-block--highlight {
  margin-block: 3rem;
}

// a dark highlight color: light text, bulma colors the titles and strong on their own
.text-block--dark {
  &,
  h2,
  h3,
  strong,
  a {
    color: #fff;
  }

  // white like the text: the underline tells them apart
  a {
    text-decoration: underline;
  }
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
