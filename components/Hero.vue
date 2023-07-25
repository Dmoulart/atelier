<template>
  <Section
    class="hero-section"
    view="fill"
    :parallax="{src: `/gallery/Tables/TableMosaiqueZoom1.jpg`}"
  >
    <h1 class="hero-section__title">
      L ' Atelier <br />
      &nbsp;de Saint-Gué
    </h1></Section
  >
</template>
<script setup lang="ts"></script>
<style lang="scss">
.hero-section {
  &__title {
    font-size: clamp(2rem, 10vw, 6rem);
    font-weight: 500;
    // color: #5c5c5c;
    color: white;
    z-index: 2;
  }
  &__slider {
    position: absolute;
    top: 0;
    left: 0;
    grid-column: 1/-1;
    width: 100%;
    z-index: 0;
  }
}
</style>
