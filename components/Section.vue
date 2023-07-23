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
<style lang="scss">
.section {
  display: grid;
  grid-template-columns: minmax(20px, auto) minmax(auto, 1040px) minmax(
      20px,
      auto
    );
  width: 100%;
  height: 100vh;

  > * {
    grid-column: 2;
  }

  &--full-width {
    > * {
      grid-column: 1/-1;
    }
  }
}
</style>
