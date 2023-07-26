<template>
  <Hero bg-image="/gallery/Commandes/poissonSculture.jpg">
    <h1>Créations sur commande</h1>
  </Hero>

  <Content>
    <h2>Des oeuvres personnalisées</h2>
    <p>
      L’atelier vous propose des créations personnelles comme du mobilier, de
      l’art de la table, des tableaux, des fresques intérieures et extérieures.
      Toutes vos envies ou projets personnels peuvent être réalisés avec un
      devis sur mesure. Pour toute information supplémentaire,
      <NuxtLink to="/#contact">contacter l’Atelier.</NuxtLink>
    </p>
    <Slider :data="getSliderData()" />
  </Content>
</template>
<script setup lang="ts">
import images from "~/public/gallery.json";

useHead({
  title: "Commandes",
});

const description = `L’atelier vous propose des créations personnelles comme du mobilier, de
      l’art de la table, des tableaux, des fresques intérieures et extérieures.
      Toutes vos envies ou projets personnels peuvent être réalisés avec un
      devis sur mesure.`;
useSeoMeta({
  description,
});

function getSliderData() {
  return images
    .filter((path) => {
      return (
        path.startsWith("Commandes") ||
        path.startsWith("CoupesEtPlateaux") ||
        path.startsWith("DessousDePlat") ||
        path.startsWith("Tableaux") ||
        path.startsWith("Tables")
      );
    })
    .map((path) => ({
      src: `/gallery/${path}`,
    }));
}
</script>

<style lang="scss"></style>
