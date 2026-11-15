<template>
  <Section>
    <Photo :src="image" :alt="alternativeText" shape="landscape" :caption="caption" />
  </Section>
</template>
<script setup lang="ts">
defineProps<{
  image: string
  alternativeText: string
  caption?: string
}>()
</script>
<transient>
  {
    "thumbnail": "/blocks/Image.svg"
  }
</transient>
