<!-- An optional title and intro text, then a carousel of photos. -->
<template>
  <Content class="photo-carousel">
    <h2 v-if="title" :class="{ 'has-text-centered': centerTitle }">{{ title }}</h2>
    <slot />
    <Slider class="mt-5" :images="images" />
  </Content>
</template>
<script setup lang="ts">
defineProps<{
  title?: string
  centerTitle?: boolean
  images: Array<{ src: string; caption?: string }>
}>()
</script>
