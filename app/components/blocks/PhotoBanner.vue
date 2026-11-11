<template>
  <Section class="photo-banner">
    <TextImgBlock :src="photo" :alt="label">{{ label }}</TextImgBlock>
  </Section>
</template>
<script setup lang="ts">
defineProps<{ photo: string; label: string }>()
</script>
<style lang="scss">
section.section.photo-banner {
  padding-top: 0;
}
section.section:has(+ .photo-banner) {
  padding-bottom: 0;
}
</style>
