<template>
  <Hero bg-image="/gallery/Tables/TableMosaiqueZoom1.jpg">
    <h1>Art thérapie</h1>
  </Hero>
  <Content align="left" view="fill">
    <template #media>
      <nuxt-img
        src="./gallery/ArtTherap1.jpg"
        alt="Oeuvre représentant des oiseaux"
        format="webp"
        height="500"
      />
    </template>
    <h2>L'art Thérapie</h2>
    <h3>Qu'est-ce que l'art thérapie ?</h3>
    <p>
      Lorsque la parole est bloquée ou insuffisante, lorsque l’esprit conscient
      empêche l’inconscient de se manifester, l’Art-thérapie offre d’autres
      moyens d’expression que le langage verbal.
    </p>

    <p>
      C’est une démarche créatrice accompagnée, qui utilise la création
      artistique dans un but thérapeutique. L’art va permettre de stimuler les
      capacités sensorielles, cognitives et motrices. Il va pénétrer les
      problématiques inconscientes et conduire à une transformation positive.
    </p>
  </Content>
</template>
<script setup lang="ts">
const title = "Art Thérapie - Atelier de St-Gué";
const description = `Démarche créatrice accompagnée, qui utilise la création
      artistique dans un but thérapeutique, l'Art Thérapie se pratique aussi à l'Atelier de St-Guénolé.`;

useSeoMeta({
  title,
  description,
  ogDescription: description,
  twitterDescription: description,
  ogTitle: title,
  twitterTitle: title,
});
</script>
