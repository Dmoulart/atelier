<!-- the atelier's three latest news, from the news pages' NewsHero (see modules/news) -->
<template>
  <Section v-if="latest.length" class="news">
    <template v-if="title">
      <h3 v-if="titleSize === 'small'" class="has-text-centered title is-3">{{ title }}</h3>
      <h2 v-else class="has-text-centered title is-2">{{ title }}</h2>
    </template>
    <ul class="news__list">
      <li v-for="item in latest" :key="item.path">
        <NuxtLink :to="item.path" class="news__card">
          <!-- decorative: the title right below says what the link is -->
          <NuxtImg
            v-if="item.image"
            class="news__image"
            :src="item.image"
            alt=""
            format="webp"
            width="480"
            height="360"
            sizes="sm:100vw md:33vw lg:360px"
            loading="lazy"
          />
          <!-- no photo: the article's band color -->
          <span v-else class="news__image" :style="{ background: item.color || '#dcc3ba' }" />
          <time v-if="item.date" class="news__date" :datetime="item.date">
            {{ formatDate(item.date) }}
          </time>
          <!-- one level under the block's title -->
          <component :is="titleSize === 'small' ? 'h4' : 'h3'" class="news__title">
            {{ item.title }}
          </component>
          <p v-if="item.seo?.description" class="news__lead">{{ item.seo.description }}</p>
        </NuxtLink>
      </li>
    </ul>
  </Section>
</template>

<script setup lang="ts">
import news from '#build/news.json'

const { title = "Les actualités de l'atelier...", titleSize = 'large' } = defineProps<{
  title?: string
  titleSize?: 'large' | 'small'
}>()

type News = {
  path: string
  image?: string
  color?: string
  title?: string
  date?: string
  seo?: { description?: string }
}

const route = useRoute()
// the module sorts them newest first
const latest = (news as News[])
  .filter((news) => {
    return news.path !== route.path
  })
  .slice(0, 3)
</script>

<style lang="scss">
.news {
  > h2,
  > h3 {
    margin-bottom: 2rem;
  }

  &__list {
    display: grid;
    gap: 2rem;
  }

  &__card {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    height: 100%;
    color: inherit;

    &:hover .news__title,
    &:focus-visible .news__title {
      color: #b4532a;
    }

    // the photo lifts, its shadow spreads under it
    &:hover .news__image,
    &:focus-visible .news__image {
      transform: translateY(-0.5rem);
      box-shadow: 0 1.5rem 3rem rgba(0, 0, 0, 0.25);
    }
  }

  &__title {
    font-size: 1.375rem;
    font-weight: 700;
    line-height: 1.25;
    transition: color 0.15s;
  }

  // same frame as the NewsHero's image
  &__image {
    display: block;
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    border-radius: 1rem;
    box-shadow: 0 0.75rem 1.5rem rgba(0, 0, 0, 0.15);
    transition:
      transform 0.3s ease-out,
      box-shadow 0.3s ease-out;
  }

  // same as the NewsHero's date
  &__date {
    margin-top: 0.25rem;
    font-size: 0.875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  &__lead {
    display: -webkit-box;
    overflow: hidden;
    line-height: 1.6;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  @include md {
    &__list {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &__image {
      transition: none;
    }

    &__card:hover .news__image,
    &__card:focus-visible .news__image {
      transform: none;
    }
  }
}
</style>
