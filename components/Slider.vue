<template>
  <carousel
    :items-to-show="1"
    v-bind="$attrs"
    :class="{'carousel--overlay': overlay}"
  >
    <slide v-for="(img, i) in data" :key="i" class="carousel__slide">
      <nuxt-img
        :src="img.src"
        class="carousel__img"
        format="webp"
        :fetchpriority="i === 0 ? 'medium' : 'low'"
        loading="lazy"
        sizes="sm:100vw md:100vw lg:100vw"
      />
    </slide>

    <template #addons>
      <navigation v-if="navigation" />
      <pagination v-if="pagination" />
    </template>
  </carousel>
</template>
<script setup lang="ts">
import "vue3-carousel/dist/carousel.css";
import {Carousel, Slide, Pagination, Navigation} from "vue3-carousel";

withDefaults(
  defineProps<{
    data: Array<{src: string}>;
    navigation?: boolean;
    pagination?: boolean;
    overlay?: boolean;
  }>(),
  {
    navigation: true,
    pagination: true,
    overlay: false,
  }
);
</script>
<style lang="scss">
.carousel {
  &--overlay::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.2),
      rgba(0, 0, 0, 1)
    );
    opacity: 0.45;
    z-index: 1;
  }

  &__slide {
    background-color: black;
  }

  &__img {
    height: 70vh;
    width: 100%;
    object-fit: contain;
  }

  &__prev,
  &__next {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    opacity: 0.5;
    background-color: rgb(0, 0, 0);
    z-index: 0;
    svg {
      fill: white;
      z-index: 1;
    }
  }

  &__pagination {
    flex-wrap: wrap;
  }
}
</style>
