<template>
  <div>
    <nuxt-img v-for="src in images" :src="src" format="webp" />
    Gallery
  </div>
</template>
<script setup lang="ts">
defineProps<{images: Array<string>}>();
</script>
