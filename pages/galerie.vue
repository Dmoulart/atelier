<template>
  <Hero bg-image="/gallery/Commandes/Mosaique3.jpg">
    <h1>Galerie</h1>
  </Hero>
  <Section>
    <Gallery :images="getImages()" />
  </Section>
</template>
<script setup lang="ts">
import gallery from "~/assets/gallery.json";

const title = "Galerie - Atelier de St-Gué";
const description = `Venez découvrir les diverses créations de Marie-Laure Barcelo Moulart à l'Atelier de St-Guénolé.`;

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
