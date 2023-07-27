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
  </section>
</template>
<script setup lang="ts">
import placeholders from "~/public/gallery-placeholders.json";

//@todo get all this parallax crap inside hero

const {fullWidth = false, parallax} = defineProps<{
  fullWidth?: boolean;
  view?: "fill";
  parallax?: {src: string; transition?: boolean};
}>();

const dims = {
  small: {height: 400, width: 400},
  medium: {height: 800, width: 800},
  big: {height: 1024, width: 1280},
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
  meta: parallax?.src
    ? [
        {name: "og:image", content: `${BASE_URL}${getImageURL(dims.big)}`},

        {name: "og:image:height", content: dims.big.height},
        {name: "og:image:width", content: dims.big.width},
        {
          name: "og:image:alt",
          content: "Une magnifique oeuvre de l'atelier de Saint-Guénolé",
        },
        {
          name: "og:type",
          content: "website",
        },
      ]
    : [],
  link: [
    parallax?.src
      ? {
          rel: "preload",
          as: "image",
          imagesrcset: `
            ${BASE_URL}${getImageURL(dims.small)} 400w,
            ${BASE_URL}${getImageURL(dims.medium)} 800w,
            ${BASE_URL}${getImageURL(dims.big)} 1600w`,
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
  max-width: 100vw;
  height: 100%;
  max-height: 100vh;
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
</style>
