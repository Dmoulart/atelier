<template>
  <div class="carousel" :data="data" ref="carousel">
    <div class="carousel__arrow carousel__arrow--left" @click="moveBy(-1)">
      &lt
    </div>
    <div class="carousel__arrow carousel__arrow--right" @click="moveBy(1)">
      >
    </div>
    <div class="carousel__view" ref="view">
      <nuxt-img
        class="carousel__img"
        v-for="img in data"
        :src="img.src"
        :format="format || 'webp'"
        loading="lazy"
        fit="cover"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  data: Array<{src: string}>;
  format?: string;
}>();

let carousel: HTMLElement;
let view: HTMLElement;

function moveBy(nb: number) {
  debugger;
  const left = Number(view.style.left);
  const width = view.getBoundingClientRect().width;
  view.style.left = `${(left || 0) + width * nb}px`;
}
</script>
<style lang="scss">
.carousel {
  position: relative;
  overflow: hidden;

  &__view {
    position: absolute;
    display: flex;
    flex-direction: row;
    top: 0;
    left: 0;
    height: 100%;
    // width: 100%;
    overflow: hidden;

    img {
      display: flex;
      flex: 1 0 0;
      object-fit: cover;
    }
  }

  &__arrow {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 50%;
    height: 54px;
    width: 54px;
    transform: translateY(-50%);
    border-radius: 50%;
    font-size: 2rem;
    cursor: pointer;
    color: white;
    background-color: black;
    z-index: 1;

    &--left {
      left: -1.5rem;
    }

    &--right {
      right: -1.5rem;
    }
  }
}
</style>
