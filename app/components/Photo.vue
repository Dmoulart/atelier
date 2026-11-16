<!-- no src yet (block just added in the editor): placeholder in the block thumbnails style -->
<template>
  <figure v-if="shape === 'landscape'" class="image is-4-by-5">
    <img v-if="!src" src="/placeholder.svg" :alt="alt" style="object-fit: none; background: #e8dfd5" width="416" height="312" />
    <nuxt-img
      v-else
      :src="src"
      :alt="alt"
      format="webp"
      loading="lazy"
      width="416"
      height="312"
      sizes="sm:100vw md:50vw lg:50vw"
    />
    <figcaption class="is-italic has-text-centered" :style="{margin: '4px'}" v-if="caption">
      {{ caption }}
    </figcaption>
  </figure>
  <img
    v-else-if="!src"
    src="/placeholder.svg" :alt="alt" style="object-fit: none; background: #e8dfd5"
    :width="shape === 'portrait' ? 400 : 416"
    :height="shape === 'portrait' ? 600 : 312"
  />
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
  caption?: string
}>()

</script>
