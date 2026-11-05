<template>
  <Slider :data="images" class="my-5" />
</template>
<script setup lang="ts">
import gallery from '~/assets/gallery.json'
import captions from '~/assets/gallery-captions.json'
import creations from '~/assets/gallery-creations-et-commandes.json'

const props = defineProps<{ album: 'ecole' | 'creations-et-commandes' }>()

const images = computed(() =>
  (props.album === 'ecole' ? gallery.filter((image) => image.startsWith('Ecole')) : creations).map(
    (image) => ({
      src: `gallery/${image}`,
      caption: (captions as Record<string, string>)[image],
    }),
  ),
)
</script>
