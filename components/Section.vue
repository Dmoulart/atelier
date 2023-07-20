<template>
  <section
    class="section"
    :class="{
      'section--full-width': fullWidth,
    }"
  >
    <slot />
  </section>
</template>
<script setup lang="ts">
const {fullWidth = false} = defineProps<{fullWidth?: boolean}>();
</script>
<style lang="scss"></style>
