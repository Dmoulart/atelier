<template>
  <Content :align="mediaSide" :view="mediaShape === 'portrait' ? 'fill' : undefined">
    <template #media>
      <Photo :src="media" :alt="mediaAlt" :shape="mediaShape" />
    </template>
    <h2 v-if="title" :class="{ 'has-text-centered': centerTitle }">{{ title }}</h2>
    <!-- in an element: an empty slot alone in Content's slot is dropped by Vue, the editor couldn't find it -->
    <div class="text-and-image__text"><slot /></div>
    <p v-if="linkLabel && linkUrl" class="has-text-centered is-size-4 mt-3">
      <a :href="linkUrl">{{ linkLabel }}</a>
    </p>
  </Content>
</template>
<script setup lang="ts">
const { mediaSide = 'right', mediaShape = 'portrait' } = defineProps<{
  title?: string
  centerTitle?: boolean
  media: string
  mediaAlt: string
  mediaSide?: 'left' | 'right'
  mediaShape?: 'portrait' | 'landscape' | 'original'
  linkLabel?: string
  linkUrl?: string
}>()
</script>
<style lang="scss">
.tr-root .text-and-image__text{
  flex: 1;
  // empty in the editor: reads as an input placeholder, in the block thumbnails grey
  &:empty:before{
    content: '✍️ Écrire ici…';
    font-style: italic;
    color: #b3aba2;
  }
}</style>
<transient>
  {
    "thumbnail": "/blocks/TextAndImage.svg"
  }
</transient>
