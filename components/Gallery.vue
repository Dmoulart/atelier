<template>
  <div class="gallery">
    <nuxt-img
      class="gallery__img"
      v-for="(src, i) in images"
      :id="`gallery-img-${String(i)}`"
      :src="`/gallery/${src}`"
      format="webp"
      @load="(img) => setStyle(img, `gallery-img-${String(i)}`)"
      loading="lazy"
      width="400"
      height="400"
    />
  </div>
</template>
<script setup lang="ts">
import images from "~/public/gallery.json";

function getSpanEstimate() {
  return (Math.random() * 2 + 1).toFixed();
  // if (size > 300) {
  //   return 3;
  // }

  // if (size > 250) {
  //   return 2;
  // }

  // return 1;
}

function setStyle(event: Event, id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.style.gridColumnEnd = `span ${getSpanEstimate()}`;
    el.style.gridRowEnd = `span ${getSpanEstimate()}`;
  }
}
</script>

<style lang="scss">
.gallery {
  // display: grid;
  // grid-template-columns: repeat(8, 1fr);
  // grid-template-rows: repeat(8, 5vw);
  // grid-gap: 15px;

  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  grid-template-rows: repeat(auto-fit, 260px);
  grid-auto-flow: dense;
  grid-gap: 0.3rem;

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
// .gallery__img {
//}
</style>
