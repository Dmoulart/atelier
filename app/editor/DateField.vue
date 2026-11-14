<!-- a custom field: a native date picker, the value stays "YYYY-MM-DD" -->
<template>
  <input
    class="date-field"
    type="date"
    :value="modelValue"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  >
</template>

<script setup lang="ts">
import type { TransientProp } from '@transient/nuxt/ir'

defineProps<{ prop: TransientProp; modelValue?: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<style scoped lang="scss">
// same look as TextAreaField
.date-field {
  display: block;
  width: 100%;
  padding: 0.5rem 0.625rem;
  font: inherit;
  font-size: 0.875rem;
  color: #23201d;
  background: #fff;
  border: 1px solid #e7e2dc;
  border-radius: 0.5rem;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;

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
