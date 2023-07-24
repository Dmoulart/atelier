<template>
  <section
    class="section"
    :class="{
      'section--full-width': fullWidth,
      'section--view-auto': view === 'auto',
    }"
  >
    <slot />
  </section>
</template>
<script setup lang="ts">
const {fullWidth = false} = defineProps<{
  fullWidth?: boolean;
  view?: "viewport" | "auto";
}>();
</script>
<style lang="scss">
.section {
  display: grid;
  grid-template-columns: minmax(20px, auto) minmax(auto, 1040px) minmax(
      20px,
      auto
    );
  width: 100%;
  min-height: 100vh;

  &--view-auto {
    min-height: auto;
  }

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
