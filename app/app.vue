<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">
// icons: the few Font Awesome ones the site uses are in style/icons.scss
useHead({
  htmlAttrs: {
    lang: 'fr',
  },
})
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
