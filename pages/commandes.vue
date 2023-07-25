<template>
  <Content>
    <h1>Créations sur commande</h1>
    <p>
      L’atelier vous propose des créations personnelles comme du mobilier, de
      l’art de la table, des tableaux, des fresques intérieures et extérieures.
      Toutes vos envies ou projets personnels peuvent être réalisés avec un
      devis sur mesure. Pour toute information supplémentaire,
      <NuxtLink to="/#contact">contacter l’Atelier.</NuxtLink>
    </p>
  </Content>
  <Section>
    <!-- <Carousel :data="getData()" style="width: 100%; height: 520px" /> -->
    <carousel :items-to-show="1">
      <slide v-for="(img, i) in getData()" :key="i">
        <nuxt-img
          :src="img.src"
          :style="{
            height: '512px',
            width: '100%',
            'object-fit': 'cover',
          }"
        />
      </slide>

      <template #addons>
        <navigation />
        <pagination />
      </template>
    </carousel>
  </Section>
</template>
<script setup lang="ts">
import images from "~/public/gallery.json";
import "vue3-carousel/dist/carousel.css";
import {Carousel, Slide, Pagination, Navigation} from "vue3-carousel";
function getData() {
  return images
    .map((path) => ({
      src: `/gallery/${path}`,
    }))
    .filter((_, i) => i < 10);
}
</script>

<style lang="scss">
// .carousel__item {
//   min-height: 200px;
//   min-width: 1024px;

//   font-size: 20px;
//   border-radius: 8px;
//   display: flex;
//   justify-content: center;
//   align-items: center;
// }
</style>
