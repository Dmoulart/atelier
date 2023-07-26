<template>
  <section
    class="section"
    :class="{
      'section--full-width': fullWidth,
      'section--view-fill': view === 'fill',
    }"
  >
    <slot />
    <div
      v-if="parallax"
      class="section__bg-img"
      :class="{'section__bg-img--transition': parallax.transition}"
    />
    <!-- <div v-if="parallax" class="section__placeholder" /> -->
  </section>
</template>
<script setup lang="ts">
import placeholders from "~/public/gallery-placeholders.json";

const {fullWidth = false, parallax} = defineProps<{
  fullWidth?: boolean;
  view?: "fill";
  parallax?: {src: string; transition?: boolean};
}>();

const dims = {
  small: {height: 400, width: 400},
  medium: {height: 800, width: 800},
  big: {height: 1024, width: 1024},
};

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
          href: `${BASE_URL}${getImageURL(dims.small)}`,
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
$bg-img-overlay: linear-gradient(0deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.35));

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

  &__bg-img {
    @extend %bg-parallax;

    background-image: v-bind(imagePlaceholder), v-bind(imageSmall),
      $bg-img-overlay;
    background-blend-mode: overlay;

    &--transition {
      @extend .unblur;
      animation-timing-function: ease-in-out;
    }
  }

  // &__placeholder {
  //   @extend %bg-parallax;

  //   // @extend .fade-out;
  //   animation-timing-function: ease-in;

  //   background-image: v-bind(imagePlaceholder);
  //   opacity: 0.5;
  // }

  > * {
    grid-column: 2;
  }

  &--full-width {
    > * {
      grid-column: 1/-1;
    }
  }

  @include sm {
    &__bg-img {
      background-image: v-bind(imagePlaceholder), v-bind(imageMedium),
        $bg-img-overlay;
    }
  }

  @include md {
    &__bg-img {
      background-image: v-bind(imagePlaceholder), v-bind(imageBig),
        $bg-img-overlay;
    }
  }
}

%bg-parallax {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

section.section {
  //override bulma padding
  padding: 3rem 0;
}

.unblur {
  animation: blur 0.5s;
  animation-direction: reverse;
  animation-fill-mode: forwards;
}

@keyframes blur {
  0% {
    filter: blur(0px);
    transform: scale(1);
  }
  100% {
    filter: blur(30px);
    -webkit-filter: blur(30px);
    transform: scale(1.1); // remove white borders
  }
}

// .fade-in {
//   animation: fade-in 0.25s;
//   animation-fill-mode: forwards;
// }

// .fade-out {
//   animation: fade-in 0.25s;
//   animation-direction: reverse;
//   animation-fill-mode: forwards;
// }

// @keyframes fade-in {
//   0% {
//     opacity: 0;
//   }
//   100% {
//     opacity: 1;
//   }
// }
</style>
