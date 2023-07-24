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
$min-margin: 20px;
$max-content-width: 1040px;

.section {
  display: grid;
  grid-template-columns:
    minmax($min-margin, auto) minmax(auto, $max-content-width)
    minmax($min-margin, auto);
  width: 100%;
  min-height: $section-min-height;

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

section.section {
  //override bulma padding
  padding: 3rem 0;
}
</style>
