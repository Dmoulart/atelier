<template>
  <Hero bg-image="/gallery/Tableaux/Arbredevie.jpg">
    <h1>Galerie</h1>
  </Hero>
  <Section class="mt-5">
    <Gallery />
  </Section>
</template>
<script setup lang="ts">
useHead({
  title: "Galerie",
});
const description = `Venez découvrir les diverses créations de Marie-Laure Moulart à l'Atelier de St-Guénolé.`;
useSeoMeta({
  description,
});
</script>
