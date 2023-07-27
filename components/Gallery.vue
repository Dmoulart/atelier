<template>
  <Slider
    v-if="current !== undefined"
    :data="getImages()"
    fullscreen
    @close="current = undefined"
    :current-slide="current"
  />

  <div class="gallery">
    <nuxt-img
      class="gallery__img"
      v-for="({src}, i) in getImages()"
      :id="`gallery-img-${String(i)}`"
      :src="src"
      format="webp"
      loading="lazy"
      sizes="sm:80vw md:50vw"
      @click="setSlide(i)"
    />
  </div>
</template>
<script setup lang="ts">
import gallery from "~/public/gallery.json";
import Slider from "./Slider.vue";

//@todo: Generate dynamic grid ?

const current = ref<number | undefined>();

function setSlide(slide: number) {
  current.value = slide;
}

function getImages() {
  const images: Array<{src: string}> = [];

  for (const image of gallery) {
    images.push({src: `gallery/${image}`});
  }

  return images;
}
</script>

<style lang="scss">
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  grid-auto-rows: 260px;
  grid-auto-flow: dense;
  grid-gap: 0.3rem;

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: pointer;
  }
}
</style>
