<template>
  <Section
    v-if="latest.length"
    class="news"
    :class="{ 'news--dark': !isLightColor(color) }"
    :style="{ background: color }"
  >
    <template v-if="title">
      <h3 v-if="titleSize === 'small'" class="has-text-centered title is-3">{{ title }}</h3>
      <h2 v-else class="has-text-centered title is-2">{{ title }}</h2>
    </template>
    <ul class="news__list">
      <li v-for="item in latest" :key="item.path">
        <NuxtLink
          :to="item.path"
          class="news__card"
          :style="{ '--news-color': item.color || '#dcc3ba' }"
        >
          <!-- the photo on an offset tile of the article's band color -->
          <span class="news__frame">
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
            <span v-else class="news__image news__image--empty" />
          </span>
          <time v-if="item.date" class="news__date" :datetime="item.date">
            {{ formatDate(item.date) }}
          </time>
          <component :is="titleSize === 'small' ? 'h4' : 'h3'" class="news__title">
            {{ item.title }}
          </component>
          <p v-if="item.seo?.description" class="news__lead">{{ item.seo.description }}</p>
          <span class="news__more">Lire l'article <span aria-hidden="true">→</span></span>
        </NuxtLink>
      </li>
    </ul>
  </Section>
</template>

<script setup lang="ts">
import news from '#build/news.json'

const {
  title = "Les actualités de l'atelier...",
  titleSize = 'large',
  color = '#f2ebe2',
} = defineProps<{
  title?: string
  titleSize?: 'large' | 'small'
  /** the section's background, the palette's cream by default */
  color?: string
}>()

type News = {
  name: string
  path: string
  image?: string
  color?: string
  title?: string
  date?: string
  seo?: { description?: string }
}

const route = useRoute()
// the page showing the block: the edited one in the editor (?page=news-stage), else the route itself
const current = computed(() => route.query.page ?? route.name)

// the module sorts them newest first; an article doesn't list itself
const latest = computed(() =>
  (news as News[]).filter((item) => item.name !== current.value).slice(0, 3),
)
</script>

<style lang="scss">
.news {
  // a dark background: light text, like TextBlock's dark highlight
  &--dark {
    &,
    .title,
    .news__more {
      color: #fff;
    }

    .news__card:hover .news__title,
    .news__card:focus-visible .news__title {
      color: inherit;
      text-decoration: underline;
    }
  }

  > h2,
  > h3 {
    margin-bottom: 2rem !important;
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

    &:hover,
    &:focus-visible {
      .news__title {
        color: #b4532a;
      }

      // the photo and its tile move apart
      .news__image {
        transform: translate(-0.25rem, -0.25rem);
      }

      .news__frame::before {
        transform: translate(1rem, 1rem);
      }

      .news__more span {
        transform: translateX(0.25rem);
      }
    }
  }

  // room for the tile, offset to the bottom right
  &__frame {
    position: relative;
    display: block;
    margin: 0 0.75rem 0.75rem 0;

    &::before {
      position: absolute;
      inset: 0;
      content: '';
      background: var(--news-color);
      border-radius: 1rem;
      transform: translate(0.75rem, 0.75rem);
      transition: transform 0.3s ease-out;
    }
  }

  &__title {
    font-size: 1.375rem;
    font-weight: 700;
    line-height: 1.25;
    transition: color 0.15s;
  }

  // same frame as the NewsHero's image, over the tile
  &__image {
    position: relative;
    display: block;
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    border-radius: 1rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.12);
    transition: transform 0.3s ease-out;

    // no photo: a lighter shade of the color, the full one stays on the tile
    &--empty {
      background: color-mix(in srgb, var(--news-color) 45%, #fff);
    }
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

  // pushed to the card's bottom: the three line up whatever their text
  &__more {
    margin-top: auto;
    padding-top: 0.25rem;
    font-weight: 700;
    color: #b4532a;

    span {
      display: inline-block;
      transition: transform 0.2s ease-out;
    }
  }

  @include md {
    &__list {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &__image,
    &__frame::before,
    &__more span {
      transition: none;
    }
  }
}
</style>
