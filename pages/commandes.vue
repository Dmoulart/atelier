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
    <Carousel :data="getData()" style="width: 100%; height: 520px" />
  </Section>
</template>
<script setup lang="ts">
import images from "~/public/gallery.json";

function getData() {
  return images
    .map((path) => ({
      src: `/gallery/${path}`,
    }))
    .filter((_, i) => i < 3);
}
</script>
