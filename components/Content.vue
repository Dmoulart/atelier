<template>
  <Section
    class="content-block"
    :class="{
      'content-block--align-left': props.align === 'left',
      'content-block--align-center': props.align === 'center',
      'content-block--view-fill': props.view === 'fill',
    }"
    :style="{
      background,
    }"
    :view="props.view"
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
  view?: "fill";
  align?: "left" | "right" | "center";
  background?: string;
}>();
</script>
<style lang="scss">
// some styling of this content component is done in global.scss (to re-use some bulma classes).
.content-block {
  p {
    line-height: 2.5;
    text-align: justify;
    // max-width: 780px; // too wide paragraph hurt the head
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__media {
    order: 1;
    min-width: 40%; // ??

    img {
      display: block;
      object-fit: cover;
    }
  }

  &--view-fill {
    .content-block {
      &__body {
        height: 100%;
      }

      &__media {
        height: 100%;

        img {
          height: 100%;
        }
      }
    }
  }

  &--align-center {
    .content-block__body {
      justify-content: center;
    }
  }

  @include sm {
    p {
      text-align: left;
    }

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
