<template>
  <main class="page">
    <Navbar :menu="menu" transparent />
    <div class="page__content">
      <slot />
    </div>
    <Footer :menu="menu" />
  </main>
</template>
<script setup lang="ts">
import {MenuItem} from "~/types/menu";

const title = "L'Atelier de St-Gué";
const defaultDescription = `L’Atelier de St-Gué est un lieu de création, d’échange et de partage autour des arts plastiques situé en Pays Bigouden à Saint-Guénolé, Penmarch.`;
useHead({
  link() {
    return [
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: `/favicon-16x16.png`,
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: `/favicon-32x32.png`,
      },
      {
        rel: "manifest",
        href: `/site.webmanifest`,
      },
    ];
  },
});
useSeoMeta({
  title,
  twitterTitle: title,
  ogTitle: title,
  description: defaultDescription,
  author: "Marie-Laure Moulart",
  applicationName: "L'Atelier de St-Guénolé",
  themeColor: "#ffffff",
});

const menu: MenuItem[] = [
  {label: "Accueil", icon: "fas fa-home", link: "/"},
  {label: "Commandes", icon: "fa-solid fa-paintbrush", link: "/commandes"},
  {label: "Galerie", icon: "fa-solid fa-palette", link: "/galerie"},
  {
    label: "Cours de mosaïque",
    icon: "fa-solid fa-person-chalkboard",
    link: "/cours-et-stages",
  },
  {
    label: "Art thérapie",
    icon: "fa-solid fa-hand-holding-hand",
    link: "/art-therapie",
  },
  {
    label: "Contact",
    icon: "fa-solid fa-envelope",
    link: "/#contact",
  },
];
</script>
<style lang="scss">
body {
  overflow-x: hidden;
  width: 100vw;
}

.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 100%;

  &__content {
    flex-grow: 1;
  }

  --first-section-mt: $nav-height;
  @include sm {
    --first-section-mt: calc(2rem + #{$nav-height});
  }

  .section:first-of-type {
    margin-top: var(--first-section-mt);
    &.hero-section {
      margin-top: 0; // don't put a margin for the hero section
    }
  }
}
</style>
