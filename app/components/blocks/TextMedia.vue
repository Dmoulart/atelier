<template>
  <Content :align="mediaSide" :view="mediaShape === 'portrait' ? 'fill' : undefined">
    <template #media>
      <Photo :src="media" :alt="mediaAlt" :shape="mediaShape" />
    </template>
    <h2 v-if="title" :class="{ 'has-text-centered': centerTitle }">{{ title }}</h2>
    <slot />
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
