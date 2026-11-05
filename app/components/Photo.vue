<template>
  <figure v-if="shape === 'landscape'" class="image is-4-by-5">
    <nuxt-img
      :src="src"
      :alt="alt"
      format="webp"
      loading="lazy"
      width="416"
      height="312"
      sizes="sm:100vw md:50vw lg:50vw"
    />
  </figure>
  <nuxt-img
    v-else
    :src="src"
    :alt="alt"
    format="webp"
    loading="lazy"
    :width="shape === 'portrait' ? 400 : undefined"
    :height="shape === 'portrait' ? 600 : undefined"
    sizes="sm:100vw md:50vw lg:50vw"
  />
</template>
<script setup lang="ts">
const { shape = 'portrait' } = defineProps<{
  src: string
  alt: string
  shape?: 'portrait' | 'landscape' | 'original'
}>()
</script>
