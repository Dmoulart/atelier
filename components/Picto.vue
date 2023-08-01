<template>
  <div class="picto">
    <span class="icon mr-1" :style="{fontSize: `${size ?? 16}px`}">
      <i :class="icon" />
    </span>
    <slot />
  </div>
</template>
<script setup lang="ts">
defineProps<{icon: string; size?: number}>();
</script>
<style lang="scss">
.picto {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
</style>
