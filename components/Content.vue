<template>
  <Section class="content" :class="{'content--left': props.align === 'left'}">
    <div class="content__body">
      <div class="content__img">
        <slot name="image" />
      </div>
      <div class="content__text">
        <slot />
      </div>
    </div>
  </Section>
</template>
<script setup lang="ts">
const props = defineProps<{align?: "left" | "right"}>();
</script>
<style lang="scss">
.content {
  &__body {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__img {
    order: 1;
  }

  p {
    line-height: 2.5;
  }

  @for $i from 1 to 6 {
    h#{$i} {
      @extend .is-#{$i} !optional;
      @extend .title !optional;
      + p {
        margin-bottom: 2rem;
      }
    }
  }

  @include sm {
    &__body {
      flex-direction: row;
    }

    &--left {
      .content__img {
        order: 0;
      }
    }
  }
}
</style>
