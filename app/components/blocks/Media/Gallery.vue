<template>
  <Content class="photo-carousel">
    <h2 v-if="title" :class="{ 'has-text-centered': centerTitle }">{{ title }}</h2>
    <slot />
    <!-- no photo yet (block just added in the editor): one placeholder slide -->
    <Slider class="mt-5" :images="images?.length ? images : [{ src: '' }]" />
  </Content>
</template>
<script setup lang="ts">
defineProps<{
  title?: string
  centerTitle?: boolean
  images: Array<{ src: string; caption?: string }>
}>()
</script>
<transient>
  {
    "thumbnail": "/blocks/Gallery.svg"
  }
</transient>
