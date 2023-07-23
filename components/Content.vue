<template>
  <Section
    class="content-block"
    :class="{
      'content-block--left': props.align === 'left',
      'content-block--center': props.align === 'center',
    }"
  >
    <div class="content-block__body">
      <div class="content-block__img">
        <slot name="image" />
      </div>
      <div class="content-block__text">
        <slot />
      </div>
    </div>
  </Section>
</template>
<script setup lang="ts">
const props = defineProps<{align?: "left" | "right" | "center"}>();
</script>
<style lang="scss">
.content-block {
  &__body {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__img {
    order: 1;
    img {
      max-height: 100vh;
    }
  }

  p {
    line-height: 2.5;
    max-width: 780px; // too wide paragraph hurt the head
  }

  @for $i from 1 to 6 {
    &--center {
      h#{$i},
      p {
        @extend .has-text-centered;
      }
    }

    h#{$i} {
      @extend .is-#{$i} !optional;
      @extend .title !optional;
      + p {
        margin-bottom: 2rem;
      }
    }
  }

  &--center {
    .content-block__body {
      justify-content: center;
    }
  }

  @include sm {
    &__body {
      flex-direction: row;
      gap: 48px;
    }

    &__img {
      max-width: 50%;
    }

    &--left {
      .content-block__img {
        order: 0;
      }
    }
  }
}
</style>
