<template>
  <Content
    class="text-block"
    :class="{ 'text-block--highlight': background }"
    :style="background && { '--surface': background }"
    :align="background ? 'center' : undefined"
  >
    <template v-if="title">
      <h3 v-if="titleSize === 'small'" class="has-text-centered">{{ title }}</h3>
      <h2 v-else class="has-text-centered">{{ title }}</h2>
    </template>
    <div class="text-block__text"><slot></slot></div>
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
.tr-root .text-block__text{
  flex: 1;
  // empty in the editor: reads as an input placeholder, in the block thumbnails grey
  &:empty:before{
    content: '✍️ Écrire ici…';
    font-style: italic;
    color: #b3aba2;
  }
}
// ink or white text, whichever reads on the color. Bulma colors the titles and strong on their own
.text-block--highlight {
  @include on-surface(var(--surface));

  margin-block: 3rem;
  background: var(--surface);

  &,
  h2,
  h3,
  strong {
    color: var(--on-surface);
  }

  // the accent shade that reads on the color, underlined: a light accent is close to white
  a {
    color: var(--on-surface-accent);
    text-decoration: underline;
  }
}

// consecutive text blocks read as one group
section.text-block + section.text-block:not(.text-block--highlight),
section.photo-carousel + section.text-block:not(.text-block--highlight) {
  padding-top: 0;
}
</style>
<transient>
  {
    "thumbnail": "/blocks/Text.svg"
  }
</transient>
