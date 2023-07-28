<template>
  <div
    class="section-bg-img"
    :class="{'section__bg-img--transition': transition}"
  />
</template>
<script setup lang="ts">
import placeholders from "~/public/gallery-placeholders.json";

const {src, transition} = defineProps<{src: string; transition?: boolean}>();

const dims = {
  small: {height: 400, width: 400},
  medium: {height: 800, width: 800},
  big: {height: 1024, width: 1280},
};

const getImagePlaceholder = () =>
  placeholders[src as keyof typeof placeholders];

const imagePlaceholder = `url(${getImagePlaceholder()})`;

const imageSmall = `url(${getImageURL(dims.small)})`;
const imageMedium = `url(${getImageURL(dims.medium)})`;
const imageBig = `url(${getImageURL(dims.big)})`;

function getImageURL(dimensions: {height: number; width: number}) {
  const img = useImage();

  return img(src, {
    format: "webp",
    height: dimensions.height, // ??
    width: dimensions.width, // ??
  });
}

const {BASE_URL} = useRuntimeConfig().public;

useHead({
  meta: [
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
  ],

  link: [
    {
      rel: "preload",
      as: "image",
      imagesrcset: `
            ${BASE_URL}${getImageURL(dims.small)} 400w,
            ${BASE_URL}${getImageURL(dims.medium)} 800w,
            ${BASE_URL}${getImageURL(dims.big)} 1600w`,
      imagesizes: "100vw",
    },
  ],
});
</script>
<style lang="scss">
$bg-img-overlay: linear-gradient(0deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.35));

.section-bg-img {
  @extend %bg-parallax;

  background-image: v-bind(imagePlaceholder), v-bind(imageSmall),
    $bg-img-overlay;
  background-blend-mode: overlay;

  &--transition {
    @extend .unblur;
    animation-timing-function: ease-in-out;
  }

  @include sm {
    background-image: v-bind(imagePlaceholder), v-bind(imageMedium),
      $bg-img-overlay;
  }
  @include md {
    background-image: v-bind(imagePlaceholder), v-bind(imageBig),
      $bg-img-overlay;
  }
}

%bg-parallax {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

@include sm {
  %bg-parallax {
    // Background attachment fixed work very bad on mobile, so we should only keep it a tablet and desktop
    // @todo?:https://css-tricks.com/the-fixed-background-attachment-hack/
    background-attachment: fixed;
  }
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
