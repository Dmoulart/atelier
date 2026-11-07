<template>
  <Section class="hero-section" view="fill" :parallax="{src: bgImage, transition: false}">
    <slot />
  </Section>
</template>
<script setup lang="ts">
const { bgImage } = defineProps<{ bgImage: string }>()

// the hero is the page cover: it is also its sharing image.
// social networks need an absolute url, and not all of them read webp
const { BASE_URL } = useRuntimeConfig().public
const img = useImage()
const ogImage = computed(() => img(bgImage, { format: 'jpeg', width: 1280, height: 1024 }))

useSeoMeta({
  ogImage: () => new URL(ogImage.value, BASE_URL).href,
  ogImageWidth: 1280,
  ogImageHeight: 1024,
  ogImageAlt: "Une magnifique oeuvre de l'atelier de Saint-Guénolé",
  ogType: 'website',
})
</script>
<style lang="scss">
.hero-section {
  position: relative;
  // center on mobile only
  place-items: center;
  text-align: center;
  height: 100vh;
  // max-height: $section-max-height;
  h1,
  h2,
  h3 {
    margin-top: calc(var(--first-section-mt) * 0.5);
    font-size: clamp(2rem, 10vw, 6rem);
    color: rgb(238, 230, 230);
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

  @include sm {
    place-items: initial;
    text-align: initial;
  }
}
</style>
