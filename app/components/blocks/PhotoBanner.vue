<!-- A wide photo with a label over it. The label is also the photo's alt. -->
<template>
  <Section class="photo-banner">
    <TextImgBlock :src="photo" :alt="label">{{ label }}</TextImgBlock>
  </Section>
</template>
<script setup lang="ts">
defineProps<{ photo: string; label: string }>()
</script>
<style lang="scss">
// banners stack as one group, right under the section before them
section.section.photo-banner {
  padding-top: 0;
}
section.section:has(+ .photo-banner) {
  padding-bottom: 0;
}
</style>
