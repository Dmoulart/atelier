<script setup lang="ts">
const model = defineModel<{ success: boolean; message: string } | null>()

const current = ref<{ success: boolean; message: string } | null>()

let toastTimer: ReturnType<typeof setTimeout> | undefined

watch(
  model,
  () => {
    if (model.value) {
      clearTimeout(toastTimer)
      current.value = model.value
      if (current.value.success) toastTimer = setTimeout(() => (current.value = null), 8000)
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => clearTimeout(toastTimer))
</script>
<template>
  <div
    v-if="current"
    class="notification publish-toast"
    :class="current.success ? 'is-success' : 'is-danger'"
    role="alert"
  >
    <button type="button" class="delete" aria-label="Fermer" @click="current = null" />
    {{ current.message }}
  </div>
</template>

<style scoped>
.publish-toast {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 9999;
  max-width: min(28rem, calc(100vw - 2rem));
}
</style>
