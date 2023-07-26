<template>
  <section
    class="section"
    :class="{
      'section--full-width': fullWidth,
      'section--view-fill': view === 'fill',
      'section--parallax': parallax?.src,
    }"
  >
    <slot />
  </section>
</template>
<script setup lang="ts">
import placeholders from "~/public/gallery-placeholders.json";

const {fullWidth = false, parallax} = defineProps<{
  fullWidth?: boolean;
  view?: "fill";
  parallax?: {src: string};
}>();

const dims = {
  small: {height: 400, width: 400},
  medium: {height: 800, width: 800},
  big: {height: 1024, width: 1024},
};
console.log(parallax?.src);
const getImagePlaceholder = () =>
  parallax?.src ? placeholders[parallax.src as keyof typeof placeholders] : "";

const imagePlaceholder = `url(${getImagePlaceholder()})`;

const imageSmall = `url(${getImageURL(dims.small)}`;
const imageMedium = `url(${getImageURL(dims.medium)})`;
const imageBig = `url(${getImageURL(dims.big)})`;

function getImageURL(dimensions: {height: number; width: number}) {
  const img = useImage();

  return parallax?.src
    ? img(parallax.src, {
        format: "webp",
        height: dimensions.height, // ??
        width: dimensions.width, // ??
      })
    : "";
}

const {BASE_URL} = useRuntimeConfig().public;

useHead({
  link: [
    parallax?.src
      ? {
          rel: "preload",
          as: "image",
          imagesrcset: `
            ${BASE_URL}${getImageURL(dims.small)} 400vw,
            ${BASE_URL}${getImageURL(dims.medium)} 800vw,
            ${BASE_URL}${getImageURL(dims.big)} 1600vw`,
          imagesizes: "100vw",
        }
      : {},
  ],
});
</script>
<style lang="scss">
$bg-img-overlay: linear-gradient(0deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.55));

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

  &--parallax {
    // @extend .unblur;
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;

    background-image: v-bind(imagePlaceholder), v-bind(imageSmall),
      $bg-img-overlay;
    background-blend-mode: overlay;

    z-index: 0;

    // &::before {
    //   // placeholder
    //   @extend .fade-out;
    //   content: "";
    //   position: absolute;
    //   top: 0;
    //   left: 0;
    //   width: 100%;
    //   height: 100%;
    //   background-attachment: fixed;
    //   background-position: center;
    //   background-repeat: no-repeat;
    //   background-size: cover;
    //   background-image: v-bind(imagePlaceholder);
    //   opacity: 0;
    // }
  }

  > * {
    grid-column: 2;
  }

  &--full-width {
    > * {
      grid-column: 1/-1;
    }
  }

  @include sm {
    &--parallax {
      background-image: v-bind(imagePlaceholder), v-bind(imageMedium),
        $bg-img-overlay;
    }
  }

  @include md {
    &--parallax {
      background-image: v-bind(imagePlaceholder), v-bind(imageBig),
        $bg-img-overlay;
      // background-image: v-bind(imageBig), $bg-img-overlay;
    }
  }
}

section.section {
  //override bulma padding
  padding: 3rem 0;
}

.unblur {
  animation: unblur 1s;
  animation-fill-mode: forwards;
}

.fade-out {
  animation: fadeout 1s;
}

@keyframes unblur {
  0% {
    filter: blur(30px);
  }
  100% {
    filter: blur(0px);
  }
}

@keyframes fadeout {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
