<template>
  <Section
    class="news-hero"
    :class="{ 'news-hero--with-image': image }"
    :style="{ '--surface': color }"
  >
    <div class="news-hero__body">
      <div class="news-hero__text">
        <time v-if="published" class="news-hero__date" :datetime="date">{{ published }}</time>
        <h1>{{ title }}</h1>
        <p v-if="seo.description" class="news-hero__lead">{{ seo.description }}</p>
      </div>
      <NuxtImg
        v-if="image"
        class="news-hero__image"
        :src="image"
        :alt="seo.imageDescription ?? ''"
        format="webp"
        width="640"
        height="480"
        sizes="sm:100vw md:50vw lg:480px"
        preload
        loading="eager"
        fetchpriority="high"
      />
    </div>
  </Section>
</template>

<script setup lang="ts">
const {
  title,
  date,
  image,
  seo = {},
  updated,
  author = 'Marie-Laure Barcelo Moulart',
  color = '#dcc3ba',
} = defineProps<{
  /** the big title, also the article's headline for Google */
  title: string
  /** a photo next to the title, also the one shared on social networks */
  image?: string
  /** publication date, YYYY-MM-DD */
  date: string
  color?: string
  /** description: a short summary, under the title, in the search results and in the news list */
  seo?: { description?: string; imageDescription?: string }
  /** date of the last real update, YYYY-MM-DD */
  updated?: string
  author?: string
}>()

const siteName = "L'Atelier de St-Guénolé"

const published = computed(() => formatDate(date))

const { BASE_URL } = useRuntimeConfig().public
const route = useRoute()
// same url as the layout's canonical: the host serves every page with a trailing slash
const url = computed(
  () => new URL(route.path.endsWith('/') ? route.path : `${route.path}/`, BASE_URL).href,
)
const img = useImage()
const ogImage = computed(() =>
  image
    ? new URL(img(image, { format: 'jpeg', width: 1280, height: 960 }), BASE_URL).href
    : undefined,
)

useSeoMeta({
  title: () => `${title} - Atelier de St-Gué`,
  ogTitle: () => title,
  twitterTitle: () => title,
  description: () => seo.description,
  ogDescription: () => seo.description,
  twitterDescription: () => seo.description,
  ogImage,
  ogImageAlt: () => seo.imageDescription,
  ogType: 'article',
  // an emptied date field gives "": no date rather than an invalid one
  articlePublishedTime: () => date || undefined,
  articleModifiedTime: () => updated || date || undefined,
  articleAuthor: () => [author],
})

// https://developers.google.com/search/docs/appearance/structured-data/article
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: () =>
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: title,
          description: seo.description,
          datePublished: date || undefined,
          dateModified: updated || date || undefined,
          image: ogImage.value ? [ogImage.value] : undefined,
          author: { '@type': 'Person', name: author },
          publisher: { '@type': 'Organization', name: siteName, url: BASE_URL },
          mainEntityOfPage: url.value,
        }),
    },
  ],
})

// the navbar isn't inside the band: <html> hands it the band's color to compute its own contrast
useHead({ htmlAttrs: { style: () => `--hero-surface: ${color}` } })
</script>

<style lang="scss">
.news-hero {
  // white on a dark band, ink on a light one: no other shade, it would lose contrast on some colors
  @include on-surface(var(--surface));

  color: var(--on-surface);
  background: var(--surface);

  // the transparent navbar sits on the band
  &.section {
    padding: calc(#{$nav-height} + 3rem) 0 3rem;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  &__text {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 1rem;
    min-width: 0;
  }

  &__date {
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--on-surface);
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  h1 {
    font-size: clamp(2.25rem, 6vw, 4rem);
    font-weight: 700;
    line-height: 1.1;
    color: var(--on-surface);
    overflow-wrap: break-word;
  }

  &__lead {
    max-width: 40rem;
    font-size: 1.125rem;
    line-height: 1.7;
    color: var(--on-surface);
  }

  &__image {
    display: block;
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    border-radius: 1rem;
    box-shadow: 0 1.5rem 3rem rgba(0, 0, 0, 0.35);
  }

  @include md {
    &.section {
      padding: calc(#{$nav-height} + 4rem) 0 4rem;
    }

    &--with-image .news-hero__body {
      flex-direction: row;
      align-items: center;
      gap: 3rem;
    }

    &__image {
      flex: 0 0 45%;
      max-width: 30rem;
    }
  }
}

// the layout pushes the first section under the navbar: this one makes room itself
.page .section.news-hero:first-of-type {
  margin-top: 0;
}

// the navbar's links read on the band: ink on a light one, white on a dark one
// (closed menu only, the open one has its own background)
.page:has(.news-hero:first-of-type) .navbar--transparent {
  @include on-surface(var(--hero-surface));

  .navbar-menu:not(.is-active) .navbar-item {
    color: var(--on-surface);
  }

  .navbar-burger:not(.is-active) span {
    background-color: var(--on-surface);
  }
}
</style>
