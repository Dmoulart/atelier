<template>
  <carousel
    :items-to-show="1"
    v-bind="$attrs"
    :class="{'carousel--overlay': overlay}"
  >
    <slide v-for="(img, i) in data" :key="i">
      <nuxt-img
        :src="img.src"
        class="carousel__img"
        loading="lazy"
        format="webp"
        :height="!height.endsWith('px') ? '1024' : height"
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
    height?: string;
  }>(),
  {
    navigation: true,
    pagination: true,
    height: "512px",
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
  &__img {
    height: v-bind(height);
    width: 100%;
    object-fit: cover;
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
}
</style>
