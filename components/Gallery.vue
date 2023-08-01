<template>
  <Slider
    v-if="currentSlide !== undefined"
    :data="images"
    fullscreen
    @close="currentSlide = undefined"
    :current-slide="currentSlide"
  />

  <div class="gallery">
    <figure class="gallery__frame" v-for="({src, caption}, i) in images">
      <nuxt-img
        class="gallery__img"
        :alt="caption ?? `Photo de l'Atelier de St-Gué`"
        :id="`gallery-img-${String(i)}`"
        :src="src"
        format="webp"
        loading="lazy"
        sizes="sm:80vw md:50vw"
        @click="setSlide(i)"
      />
      <figcaption class="gallery__caption" v-if="caption">
        {{ caption }}
      </figcaption>
    </figure>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  images: Array<{src: string; caption?: string}>;
}>();

//@todo: Generate dynamic grid ?

const currentSlide = ref<number | undefined>();

function setSlide(slide: number) {
  currentSlide.value = slide;
}

watch(currentSlide, () => {
  if (window) {
    // lock scroll
    document.documentElement.style.overflow =
      currentSlide.value !== undefined ? "hidden" : "auto";
  }
});
</script>

<style lang="scss">
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  grid-auto-rows: 260px;
  grid-auto-flow: dense;
  grid-gap: 0.3rem;

  &__frame {
    position: relative;
    overflow: hidden;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: pointer;
    transition: 300ms;
    scale: 1;

    &:hover {
      scale: 1.1;
      transition: 300ms;
      + .gallery__caption {
        opacity: 1;
        transition: 300ms;
      }
    }
  }

  &__caption {
    opacity: 0;
    transition: 300ms;
    @extend %caption;
  }
}
</style>
