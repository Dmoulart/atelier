<template>
  <div class="text-img-block">
    <nuxt-img
      :src="src"
      :alt="alt"
      format="webp"
      sizes="sm:100vw md:100vw lg:100vw"
      loading="lazy"
    />
    <div class="text-img-block__text">
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{src: string; alt: string}>();
</script>
<style lang="scss">
.text-img-block {
  position: relative;
  display: flex;
  padding: 1rem;
  width: 100%;
  height: 300px;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.3) 0%,
      rgba(0, 0, 0, 0.5) 50%,
      rgba(255, 255, 255, 0.3) 100%
    );
    opacity: 0.5;
    z-index: 0;
    border-radius: 12px;
  }

  img {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    object-fit: cover;
    z-index: 0;
    border-radius: 12px;
  }

  &__text {
    display: flex;
    justify-content: center;
    align-items: center;
    color: $font-white;
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1.5;
    width: 100%;
    z-index: 1;
  }

  //   @include sm {
  //     margin-left: auto;
  //     width: 50%;
  //   }
}
</style>
