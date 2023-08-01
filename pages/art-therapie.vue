<template>
  <Hero bg-image="/gallery/CreationsEtCommandes/11.jpg">
    <h1>Art thérapie</h1>
  </Hero>
  <Content align="center">
    <blockquote>
      « L'ouverture de mon atelier d'artiste depuis 2005 m'a aidée à développer
      ma capacité créative en utilisant la technique de la mosaïque et de la
      peinture.
      <br />
      <br />J'y anime et encadre des ateliers autour de ces pratiques. Cette
      démarche artistique va permettre à chacun de s'exprimer, de se raconter et
      se révéler à travers son œuvre. »
    </blockquote>
  </Content>
  <Divider />
  <Content align="left" view="fill">
    <template #media>
      <nuxt-img
        src="./gallery/ArtTherap1.jpg"
        alt="Oeuvre représentant des oiseaux"
        format="webp"
        width="400"
        height="600"
        sizes="sm:100vw md:50vw lg:50vw"
      />
    </template>
    <h2>L'art Thérapie</h2>
    <h3>Qu'est-ce que l'art thérapie ?</h3>
    <p>
      Lorsque la parole est bloquée ou insuffisante, lorsque l’esprit conscient
      empêche l’inconscient de se manifester,
      <strong
        >l’Art-thérapie offre d’autres moyens d’expression que le langage
        verbal</strong
      >.
    </p>

    <p>
      C’est une <strong>démarche créatrice accompagnée</strong>, qui utilise la
      création artistique dans un but thérapeutique. L’art va permettre de
      stimuler les capacités sensorielles, cognitives et motrices. Il va
      pénétrer les problématiques inconscientes et conduire à une transformation
      positive.
    </p>
  </Content>

  <Content align="left">
    <h3 class="has-text-centered">Pour qui est l'art-thérapie ?</h3>
    <p>
      <strong
        >Toute personne peut bénéficier de l’art-thérapie et à tout âge</strong
      >. Elle s’utilise dans de nombreux domaines : addiction, dépression,
      phobie, anxiétés, difficultés relationnelles, perte affective, troubles
      psychiatriques, maladie somatique… etc.
    </p>
    <br />
    <h3 class="has-text-centered">Comment se déroule la séance ?</h3>
    <p>
      Elle se déroule en trois temps : D’abord un
      <strong>temps d’accueil et d’échange </strong>; Ensuite un
      <strong>temps de création </strong>; Enfin un
      <strong>temps pour faire le bilan</strong>
      sur le vécu et le ressenti de la séance.
    </p>
    <br />
    <h3 class="has-text-centered">Mes garanties professionnelles</h3>
    <p>
      <strong>Climat d’écoute, de bienveillance et confidentialité</strong>.
      Accompagnement dans un processus de création. Aucun jugement ni
      interprétation de ce que vous aurez produit. <br />
      Je vous accompagne et encourage dans votre créativité avec les outils et
      matériaux mis à votre disposition dans un cadre sécurisant et
      bienveillant.
    </p>

    <h3 class="has-text-centered">Mediums</h3>
    <p>
      Dans le cadre de nos séances, vous pourrez utiliser les mediums suivants :
    </p>

    <TextImgBlock class="my-4" src="/mediums/acrylic.jpg" alt="Acrylique">
      Acrylique
    </TextImgBlock>

    <TextImgBlock class="my-4" src="/mediums/ink.jpg" alt="Dessin et encre">
      Dessin et encre
    </TextImgBlock>

    <TextImgBlock
      class="my-4"
      src="/mediums/mosaic.jpg"
      alt="Collage et mosaïque"
    >
      Collage et mosaïque
    </TextImgBlock>

    <TextImgBlock class="my-4" src="/mediums/clay.jpg" alt="Argile">
      Argile
    </TextImgBlock>
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
