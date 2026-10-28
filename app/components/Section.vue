<template>
  <section
    class="section"
    :class="{
      'section--full-width': fullWidth,
      'section--view-fill': view === 'fill',
    }"
  >
    <slot />

    <section-bg-image
      v-if="parallax"
      :transition="parallax.transition"
      :src="parallax.src"
    />
  </section>
</template>
<script setup lang="ts">
const {fullWidth = false, parallax} = defineProps<{
  fullWidth?: boolean;
  view?: "fill";
  parallax?: {src: string; transition?: boolean};
}>();
</script>
<style lang="scss">
.section {
  display: grid;
  grid-template-columns:
    minmax($section-min-inline-margin, auto) minmax(
      auto,
      $section-max-content-width
    )
    minmax($section-min-inline-margin, auto);
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
