<template>
  <Hero bg-image="/gallery/Ecole/VagueStJean.jpg">
    <h1>Cours et stages de mosaique</h1>
  </Hero>

  <Content view="fill">
    <template #media>
      <nuxt-img
        alt="Image d'un cours se déroulant à l'atelier"
        src="gallery/Cours_atelier.jpg"
        format="webp"
        loading="lazy"
        width="400"
        height="600"
        sizes="sm:100vw md:50vw lg:50vw"
      />
    </template>

    <h2>Des stages pour tous niveaux</h2>

    <p>
      L’atelier organise à l’année des cours et des stages pour enfants ados et
      adultes, groupes scolaires, colonies, etc.
    </p>

    <p>
      Débutant ou initié, vous pourrez apprendre les techniques de base ou
      progresser sur de nouvelles créations.
    </p>
    <br />
    <p>
      Dans une ambiance calme et conviviale, venez réaliser une mosaïque.
      <strong>Enfants, ados et adultes, en groupe : les cours s’adaptent</strong
      >. Laissez votre créativité s’exprimer !
    </p>
  </Content>
  <Divider />
  <Content align="left">
    <template #media>
      <figure class="image is-4-by-5">
        <nuxt-img
          alt="Image d'un cours se déroulant à l'atelier"
          src="gallery/Latelier.jpg"
          format="webp"
          loading="lazy"
          width="416"
          height="312"
          sizes="sm:100vw md:50vw lg:50vw"
        />
      </figure>
    </template>
    <p>
      L’enseignement à l’Atelier mènera les stagiaires débutants, guidés par
      Marie-Laure, vers des techniques diverses nécessaires à la création d’une
      œuvre personnelle.
    </p>
    <p>
      Initiés, les cours vous amèneront à
      <strong
        >affiner vos techniques en découvrant de nouvelles méthodes de
        travail</strong
      >
      qui stimuleront votre créativité et vos sens artistiques.
    </p>
  </Content>

  <Content align="center" background="aliceblue" class="my-5">
    <p>
      L’atelier vous propose des séances de 2 heures qui se déroulent soit le
      <strong>matin de 10h à 12h</strong> soit
      <strong>l’après-midi de 14h30 à 16h30</strong>, ainsi qu’un cours en
      <strong>soirée de 18h à 20h</strong> selon les disponibilités du planning.
    </p>
  </Content>

  <Content class="my-5">
    <h2 class="has-text-centered">Groupes colonies et écoles</h2>
    <p>
      L’Atelier propose d’<strong
        >animer un atelier mosaïque auprès d’enfants en structure scolaire ou de
        loisirs</strong
      >. De manière ludique, les enfants ont la possibilité de développer de
      nouvelles compétences plastiques en explorant les formes et les couleurs
      ainsi que les possibilités d’assemblage.
    </p>
    <Slider :data="getSliderData()" class="my-5" />
    <p>
      L’activité mosaïque leur permettra de
      <strong
        >développer à la fois leur créativité et leur concentration </strong
      >dans la réalisation de leur production (qu’elle soit individuelle ou
      collective). Pour plus d’infos sur la mise en œuvre d’atelier mosaïque
      n’hésitez pas à <NuxtLink to="/#contact">me contacter</NuxtLink>.
      L’Atelier se déplace aussi à l’extérieur
    </p>
  </Content>

  <Divider />

  <Content class="my-5">
    <template #media>
      <PricesTable style="height: 100%" />
    </template>

    <h2 class="has-text-centered">Tarifs de l'Atelier de Saint Gué</h2>
    <p>
      Une séance dure 2 heures ; deux séances minimum. Tarifs dégressifs à
      partir de la 3ème et 7ème séance. Modes de règlement acceptés : chèques et
      espèces
    </p>
    <p>
      Les tarifs comprennent le prêt de l’outillage, tous les matériaux (émaux,
      pâtes de verre, ardoise, miroir, grès) colle et ciment. Des petits
      supports en bois, des planches petit format ainsi que du filet sont à
      votre disposition. Si vous souhaitez travaillez une autre dimension ou
      d’autres matériaux, vous en aurez la charge.
    </p>
  </Content>
</template>
<script setup lang="ts">
import gallery from "~/public/gallery.json";

const title = "Cours et Stages - Atelier de St-Gué";
const description = `L’atelier organise à l’année des cours et des stages pour enfants ados et adultes, groupes scolaires, colonies, etc.  Dans une ambiance calme et conviviale, venez réaliser une mosaïque. Laissez votre créativité s'exprimer`;
useSeoMeta({
  title,
  description,
  ogDescription: description,
  twitterDescription: description,
  ogTitle: title,
  twitterTitle: title,
});

function getSliderData() {
  const images: Array<{src: string}> = [];

  for (const image of gallery) {
    if (image.startsWith("Ecole")) {
      images.push({src: `gallery/${image}`});
    }
  }

  return images;
}
</script>
