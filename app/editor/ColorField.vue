<!-- a custom field: one of the suggested colors, or any other one. The value is its "#rrggbb" code -->
<template>
  <div class="color-field">
    <!-- only without a default: a band that must have a color (NewsHero) can't be cleared -->
    <button
      v-if="!prop.default"
      type="button"
      class="color-field__swatch color-field__none"
      :aria-pressed="!selected"
      aria-label="Aucune couleur"
      title="Aucune couleur"
      @click="emit('update:modelValue', '')"
    />
    <button
      v-for="color in palette"
      :key="color.value"
      type="button"
      class="color-field__swatch"
      :aria-pressed="selected === color.value"
      :aria-label="color.name"
      :title="color.name"
      :style="{ background: color.value }"
      @click="emit('update:modelValue', color.value)"
    />
    <!-- the native picker: the swatch shows the custom color once picked -->
    <label
      class="color-field__swatch color-field__custom"
      :class="{ 'is-checked': custom }"
      title="Autre couleur"
      :style="custom ? { background: selected } : undefined"
    >
      <input
        type="color"
        :value="selected || '#ffffff'"
        aria-label="Autre couleur"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      >
      <span v-if="!custom" aria-hidden="true">+</span>
    </label>
  </div>
</template>

<script setup lang="ts">
import type { TransientProp } from '@transient/nuxt/ir'

const props = defineProps<{ prop: TransientProp; modelValue?: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

// no value yet: the prop's own default, if any. The quotes: in case the analyzer keeps a 'single quoted' one
const selected = computed(() =>
  String(props.modelValue || props.prop.default || '')
    .replace(/['"]/g, '')
    .toLowerCase(),
)
const custom = computed(
  () => !!selected.value && !palette.some(({ value }) => value === selected.value),
)
</script>

<style scoped lang="scss">
.color-field {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  &__swatch {
    position: relative;
    display: grid;
    place-items: center;
    width: 2rem;
    height: 2rem;
    padding: 0;
    cursor: pointer;
    border: 0;
    border-radius: 50%;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.15);
    transition: transform 0.15s;

    &:hover {
      transform: scale(1.1);
    }

    &[aria-pressed='true'],
    &.is-checked {
      box-shadow:
        0 0 0 2px #fff,
        0 0 0 4px #b4532a;
    }

    &:focus-visible,
    &:has(input:focus-visible) {
      outline: 2px solid #b4532a;
      outline-offset: 4px;
    }
  }

  // white, crossed out in red: the usual "no color"
  &__none {
    background:
      linear-gradient(
        to top right,
        transparent calc(50% - 1px),
        #b3261e calc(50% - 1px) calc(50% + 1px),
        transparent calc(50% + 1px)
      ),
      #fff;
  }

  &__custom {
    font-size: 1.125rem;
    line-height: 1;
    color: #6f6861;
    background: conic-gradient(#dcc3ba, #b3b89c, #2f5f5e, #74407a, #a4532f, #dcc3ba);

    span {
      display: grid;
      place-items: center;
      width: 1.25rem;
      height: 1.25rem;
      background: #fff;
      border-radius: 50%;
    }

    // invisible but clickable: the label's color is the swatch
    input {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
      opacity: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &__swatch {
      transition: none;
    }
  }
}
</style>
