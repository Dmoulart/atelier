<!-- a custom field for the `seo` object prop: one French labelled textarea per key the component declares -->
<template>
  <div class="seo-field">
    <div v-for="key in keys" :key="key" class="seo-field__row">
      <label class="seo-field__label" :for="`${id}-${key}`">{{ texts[key]?.label ?? key }}</label>
      <p v-if="texts[key]" class="seo-field__hint">{{ texts[key].hint }}</p>
      <TextAreaField
        :id="`${id}-${key}`"
        :prop="prop"
        :model-value="modelValue?.[key]"
        @update:model-value="(value) => emit('update:modelValue', { ...modelValue, [key]: value })"
      />
      <p
        v-if="texts[key]"
        class="seo-field__count"
        :class="{ 'seo-field__count--over': length(key) > texts[key].max }"
      >
        {{ length(key) }} / {{ texts[key].max }} caractères
        <template v-if="length(key) > texts[key].max">: un peu long, Google risque de couper la fin</template>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TransientProp } from '@transient/nuxt/ir'
import { computed, useId } from 'vue'
import TextAreaField from './TextAreaField.vue'

type Seo = Record<string, string | undefined>

const props = defineProps<{ prop: TransientProp; modelValue?: Seo }>()
const emit = defineEmits<{ 'update:modelValue': [value: Seo] }>()

// max is not a hard limit: past it Google truncates, the text stays valid
const texts: Record<string, { label: string; hint: string; max: number }> = {
  title: {
    label: 'Titre dans Google',
    hint: "Le titre cliquable dans les résultats de recherche, et le nom de l'onglet du navigateur. Utilisez les mots que les gens taperaient, ex. « Cours et stages de mosaïque - Atelier de St-Gué ».",
    max: 60,
  },
  description: {
    label: 'Résumé',
    hint: "Le petit texte sous le titre dans Google, et l'aperçu quand le lien est partagé (Facebook, WhatsApp…). Une ou deux phrases qui donnent envie de cliquer. Pour une actualité, il s'affiche aussi sous le titre de l'article.",
    max: 155,
  },
  imageDescription: {
    label: "Description de l'image",
    hint: "Décrit la photo pour les personnes malvoyantes et pour Google Images. Dites simplement ce qu'on voit, ex. « Mosaïque d'une vague bleue réalisée par des élèves ».",
    max: 125,
  },
}

const id = useId()
// the keys the component declares, in its order
const keys = computed(() => {
  const type = props.prop.type
  return typeof type === 'object' && type.kind === 'object' ? Object.keys(type.object) : []
})
const length = (key: string) => props.modelValue?.[key]?.length ?? 0
</script>

<style scoped lang="scss">
.seo-field {
  display: grid;
  gap: 1rem;

  &__label {
    display: block;
    font-weight: 600;
    font-size: 0.875rem;
    color: #23201d;
  }

  &__hint {
    margin: 0.25rem 0 0.5rem;
    font-size: 0.8125rem;
    line-height: 1.4;
    color: #6f6861;
  }

  &__count {
    margin: 0.25rem 0 0;
    font-size: 0.75rem;
    color: #6f6861;
    text-align: right;

    &--over {
      color: #b4532a;
    }
  }
}
</style>
