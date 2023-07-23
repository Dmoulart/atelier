<template>
  <Section
    class="text-img-block"
    :class="{'text-img-block--left': props.align === 'left'}"
  >
    <div class="text-img-block__content">
      <div class="text-img-block__img">
        <slot name="image" />
      </div>
      <div class="text-img-block__text">
        <slot name="text" />
      </div>
    </div>
  </Section>
</template>
<script setup lang="ts">
const props = defineProps<{align?: "left" | "right"}>();
</script>
<style lang="scss">
.text-img-block {
  &__content {
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
    &__content {
      flex-direction: row;
    }

    &--left {
      .text-img-block__img {
        order: 0;
      }
    }
  }
}
</style>
