<template>
  <main class="page">
    <Navbar class="page__nav" />
    <NuxtPage />
  </main>
</template>
<script setup lang="ts">
useHead({
  title: "L'Atelier de St Guénolé",
  link: [
    {
      rel: "stylesheet",
      href: "https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;500;600;70",
    },
    {
      rel: "stylesheet",
      href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css",
      integrity:
        "sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g==",
      crossorigin: "anonymous",
      referrerpolicy: "no-referrer",
    },
  ],
});
</script>
<style lang="scss">
body {
  font-family: "Comfortaa", Arial, Helvetica, sans-serif;
}

.page {
  display: grid;
  grid-template-areas: "nav nav nav" "content content content" "footer footer footer";
  grid-template-columns: minmax(20px, auto) minmax(auto, 1040px) minmax(
      20px,
      auto
    );

  &__nav {
    grid-area: nav;
  }

  > .section {
    grid-area: content;
    grid-column: 2;

    &--full-width {
      grid-column: 1/-1;
    }
  }
}
</style>
