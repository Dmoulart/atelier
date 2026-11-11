<!-- a custom field: gets the same props as PropField, emits update:modelValue -->
<template>
  <textarea
    class="textarea-field"
    rows="3"
    :value="modelValue"
    @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  />
</template>

<script setup lang="ts">
import type { TransientProp } from '@transient/nuxt/ir'

defineProps<{ prop: TransientProp; modelValue?: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<style scoped lang="scss">
// same look as PhotoField
.textarea-field {
  display: block;
  width: 100%;
  min-height: 5rem;
  max-height: 20rem;
  // grows with its text, where supported; the handle stays for the others
  field-sizing: content;
  resize: vertical;
  padding: 0.5rem 0.625rem;
  font: inherit;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #23201d;
  background: #fff;
  border: 1px solid #e7e2dc;
  border-radius: 0.5rem;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;

  &::placeholder {
    color: #6f6861;
  }

  &:hover {
    border-color: #b4532a;
  }

  &:focus {
    outline: none;
    border-color: #b4532a;
    box-shadow: 0 0 0 3px #fbeee7;
  }
}
</style>
