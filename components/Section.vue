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

  &--full-width {
    grid-column: 1/-1;

    > * {
      grid-column: 2;
    }
  }

  > * {
    grid-column: 2;
  }
}

// override bulma padding. find a way to make this cleaner
section.section {
  padding: 0;
}
</style>
