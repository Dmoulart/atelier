<template>
  <Section class="hero-section" view="fill" :parallax="{src: bgImage}">
    <slot />
  </Section>
</template>
<script setup lang="ts">
defineProps<{bgImage: string}>();
</script>
<style lang="scss">
.hero-section {
  &__title,
  h1,
  h2,
  h3 {
    font-size: clamp(2rem, 10vw, 6rem);
    font-weight: 500;
    margin-top: calc(var(--first-section-mt) * 0.5);
    // color: #5c5c5c;
    color: white;
    z-index: 2;
  }

  &__slider {
    position: absolute;
    top: 0;
    left: 0;
    grid-column: 1/-1;
    width: 100%;
    z-index: 0;
  }
}
</style>
