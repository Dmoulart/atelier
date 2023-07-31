<template>
  <Hero bg-image="/gallery/Commandes/poissonSculture.jpg">
    <h1>Créations et commandes</h1>
  </Hero>

  <Content>
    <h2>Des œuvres personnalisées</h2>
    <p>
      L’atelier vous propose des créations personnelles comme du mobilier, de
      l’art de la table, des tableaux, des fresques intérieures et extérieures.
      Toutes vos envies ou projets personnels peuvent être réalisés avec un
      devis sur mesure. Pour toute information supplémentaire,
      <NuxtLink to="/#contact">contacter l’Atelier.</NuxtLink>
    </p>
    <Gallery :images="getImages()" />
  </Content>
</template>
<script setup lang="ts">
import gallery from "~/assets/gallery.json";

const title = "Créations et commandes - Atelier de St-Gué";
const description = `L’atelier vous propose des créations personnelles comme du mobilier, de
      l’art de la table, des tableaux, des fresques intérieures et extérieures.
      Toutes vos envies ou projets personnels peuvent être réalisés avec un
      devis sur mesure.`;

useSeoMeta({
  title,
  description,
  ogDescription: description,
  twitterDescription: description,
  ogTitle: title,
  twitterTitle: title,
});

function getImages() {
  const images: Array<{src: string}> = [];

  for (const image of gallery) {
    if (
      image.startsWith("Commandes") ||
      image.startsWith("CoupesEtPlateaux") ||
      image.startsWith("DessousDePlat") ||
      image.startsWith("Exterieur") ||
      image.startsWith("Tableaux") ||
      image.startsWith("Tables")
    )
      images.push({src: `gallery/${image}`});
  }

  return images;
}
</script>

<style lang="scss"></style>
