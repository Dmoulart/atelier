<template>
  <Section class="hero-section" view="fill" :parallax="{src: backgroundImage, transition: false}">
    <slot />
  </Section>
</template>
<script setup lang="ts">
const {
  backgroundImage,
  imageDescription = "Une magnifique oeuvre de l'atelier de Saint-Guénolé",
  seoTitle,
  seoDescription,
} = defineProps<{
  backgroundImage: string
  imageDescription?: string
  // the page title and description in search results and shared links
  seoTitle?: string
  seoDescription?: string
}>()

// the hero is the page cover: it is also its sharing image.
// social networks need an absolute url, and not all of them read webp
const { BASE_URL } = useRuntimeConfig().public
const img = useImage()
const ogImage = computed(() => img(backgroundImage, { format: 'jpeg', width: 1280, height: 1024 }))

useSeoMeta({
  title: () => seoTitle,
  ogTitle: () => seoTitle,
  twitterTitle: () => seoTitle,
  description: () => seoDescription,
  ogDescription: () => seoDescription,
  twitterDescription: () => seoDescription,
  ogImage: () => new URL(ogImage.value, BASE_URL).href,
  ogImageWidth: 1280,
  ogImageHeight: 1024,
  ogImageAlt: () => imageDescription,
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
