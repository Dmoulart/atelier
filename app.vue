<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: "fr",
  },
  link: [
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
// import FontFaceObserver from "fontfaceobserver";
// @todo : work on fallback font
// onBeforeMount(() => {
//   const font = new FontFaceObserver("Comfortaa", {
//     weight: 400,
//   });

//   font.load().then(function () {
//     document.body.classList.add("font-loaded");
//   });
// });
</script>
<style lang="scss"></style>
