<template>
  <div class="carousel__close" v-if="fullscreen" @click="$emit('close')">X</div>
  <carousel
    :items-to-show="1"
    v-bind="$attrs"
    :class="{'carousel--overlay': overlay, 'carousel--fullscreen': fullscreen}"
    :model-value="currentSlide"
  >
    <slide
      v-for="({src, caption}, i) in data"
      :key="i"
      class="carousel__slide"
      @click="$emit('close')"
    >
      <figure class="carousel__figure">
        <nuxt-img
          :src="src"
          class="carousel__img"
          :fetchpriority="i === 0 ? 'medium' : 'low'"
          loading="lazy"
          sizes="sm:80vw md:50vw lg:40vw"
          format="webp"
          :alt="caption ?? `Photo de l'Atelier de St-Gué`"
        />
        <figcaption v-if="caption" class="carousel__caption">
          {{ caption }}
        </figcaption>
      </figure>
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
    data: Array<{src: string; caption?: string}>;
    currentSlide?: number;
    navigation?: boolean;
    pagination?: boolean;
    overlay?: boolean;
    fullscreen?: boolean;
  }>(),
  {
    navigation: true,
    pagination: true,
    overlay: false,
  }
);

defineEmits(["close"]);
</script>
<style lang="scss">
.carousel {
  &--fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 1;

    .carousel__img {
      height: 100vh;
    }

    &::before {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      background-color: black;
      opacity: 0.5;
    }
  }

  &__close {
    position: fixed;
    top: 0;
    right: 0;
    font-size: 1.5rem;
    font-weight: 600;
    z-index: 10;
    cursor: pointer;
    padding: 1rem;
    transition: 300ms;
    scale: 1;

    &:hover {
      color: white;
      transition: 300ms;
      scale: 1.1;
    }
  }

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

  &__figure {
    margin: 0;
  }

  &__img {
    display: block;
    height: 50vh;
    width: 100%;
    object-fit: contain;
  }

  &__caption {
    @extend %caption;
  }

  &__prev,
  &__next {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    opacity: 0.5;
    background-color: rgb(0, 0, 0);
    z-index: 0;
    scale: 1;
    transition: 300ms;

    svg {
      fill: white;
      z-index: 1;
    }

    &:hover {
      scale: 1.2;
      opacity: 0.8;
      transition: 300ms;
    }
  }

  &__pagination {
    flex-wrap: wrap;
  }

  @include sm {
    &__img {
      height: 70vh;
    }
  }
}
</style>
