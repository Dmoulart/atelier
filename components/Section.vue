<template>
  <section
    class="section"
    :class="{
      'section--full-width': fullWidth,
      'section--view-fill': view === 'fill',
    }"
  >
    <slot />
  </section>
</template>
<script setup lang="ts">
const {fullWidth = false} = defineProps<{
  fullWidth?: boolean;
  view?: "fill";
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
  min-height: auto;
  scroll-margin-top: 1rem;

  &--view-fill {
    min-height: $section-min-height;
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
