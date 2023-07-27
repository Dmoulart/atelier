<template>
  <Hero bg-image="/gallery/Commandes/Mosaique3.jpg">
    <h1>Galerie</h1>
  </Hero>
  <Section style="background-color: black">
    <Gallery />
  </Section>
</template>
<script setup lang="ts">
const title = "Galerie - Atelier de St-Gué";
const description = `Venez découvrir les diverses créations de Marie-Laure Moulart à l'Atelier de St-Guénolé.`;

useSeoMeta({
  title,
  description,
  ogDescription: description,
  twitterDescription: description,
  ogTitle: title,
  twitterTitle: title,
});
</script>
