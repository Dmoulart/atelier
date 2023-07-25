<template>
  <carousel :items-to-show="1" v-bind="$attrs">
    <slide v-for="(img, i) in data" :key="i">
      <nuxt-img
        :src="img.src"
        class="carousel__img"
        loading="lazy"
        format="webp"
        height="1024"
      />
    </slide>

    <template #addons>
      <navigation />
      <pagination />
    </template>
  </carousel>
</template>
<script setup lang="ts">
import "vue3-carousel/dist/carousel.css";
import {Carousel, Slide, Pagination, Navigation} from "vue3-carousel";

defineProps<{data: Array<{src: string}>}>();
</script>
<style lang="scss">
.carousel__img {
  height: 512px;
  width: 100%;
  object-fit: cover;
}
</style>
