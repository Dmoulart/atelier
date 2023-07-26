<template>
  <section
    class="section"
    :class="{
      'section--full-width': fullWidth,
      'section--view-fill': view === 'fill',
      'section--parallax': parallax?.src,
    }"
    :style="parallax?.src ? backgroundStyle : ''"
  >
    <slot />
  </section>
</template>
<script setup lang="ts">
const {fullWidth = false, parallax} = defineProps<{
  fullWidth?: boolean;
  view?: "fill";
  parallax?: {src: string};
}>();

const img = useImage();

const backgroundStyle = computed(() => {
  if (parallax) {
    return {backgroundImage: `url('${getImageURL()}')`};
  } else {
    return "";
  }
});

const imageDimensions = {
  height: 600,
  width: 600,
};

function getImageURL() {
  return parallax?.src
    ? img(parallax.src, {
        format: "webp",
        height: imageDimensions.height, // ??
        width: imageDimensions.width, // ??
      })
    : "";
}

const {BASE_URL} = useRuntimeConfig().public;

useHead({
  link: [
    parallax?.src
      ? {
          rel: "preload",
          as: "image",
          href: `${BASE_URL}${getImageURL()}`,
        }
      : {},
  ],
});
</script>
<style lang="scss">
.section {
  display: grid;
  grid-template-columns:
    minmax($section-min-inline-margin, auto) minmax(
      auto,
      $section-max-content-width
    )
    minmax($section-min-inline-margin, auto);
  width: 100%;
  min-height: auto;
  max-height: $section-max-height;
  scroll-margin-top: 1rem;

  &--view-fill {
    min-height: $section-min-height;
  }

  &--parallax {
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    z-index: 1;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      max-height: $section-max-height;
      background-image: linear-gradient(
        0deg,
        rgba(0, 0, 0, 0),
        rgba(0, 0, 0, 1)
      );
      opacity: 0.45;
      z-index: 0;
    }
  }

  > * {
    grid-column: 2;
  }

  &--full-width {
    > * {
      grid-column: 1/-1;
    }
  }
}

section.section {
  //override bulma padding
  padding: 3rem 0;
}
</style>
