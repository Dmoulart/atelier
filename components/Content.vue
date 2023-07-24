<template>
  <Section
    class="content-block"
    :class="{
      'content-block--align-left': props.align === 'left',
      'content-block--align-center': props.align === 'center',
    }"
    :style="{
      background,
    }"
    v-bind="$attrs"
  >
    <div class="content-block__body">
      <div v-if="$slots.media" class="content-block__media">
        <slot name="media" />
      </div>
      <div class="content-block__text">
        <slot />
      </div>
    </div>
  </Section>
</template>
<script setup lang="ts">
const props = defineProps<{
  align?: "left" | "right" | "center";
  background?: string;
}>();
</script>
<style lang="scss">
.content-block {
  &__body {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 24px;
  }

  &__media {
    display: flex;
    place-items: center;
    order: 1;
    min-width: 40%; // ??
    height: 100%;

    img {
      display: block;
      height: 100%;
      object-fit: cover;
    }
  }

  p {
    line-height: 2.5;
    // max-width: 780px; // too wide paragraph hurt the head
  }

  @for $i from 1 to 6 {
    &--align-center {
      h#{$i},
      p {
        @extend .has-text-centered;
      }
    }

    // automatic title bulma styling inside content
    h#{$i} {
      @extend .is-#{$i} !optional;
      @extend .title !optional;
      + p {
        margin-bottom: 2rem;
      }
    }
  }

  &--align-center {
    .content-block__body {
      justify-content: center;
    }
  }

  @include sm {
    &__body {
      flex-direction: row;
      gap: 48px;
    }

    &__media {
      max-width: 50%;
    }

    &--align-left {
      .content-block__media {
        order: 0;
      }
    }
  }
}
</style>
