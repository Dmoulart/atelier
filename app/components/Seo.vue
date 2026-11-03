<template></template>
<script setup lang="ts">
// renderless: only fills the page <head>
const { title, description } = defineProps<{
  title?: string;
  description?: string;
}>();

useSeoMeta({
  title: () => title,
  ogTitle: () => title,
  twitterTitle: () => title,
  description: () => description,
  ogDescription: () => description,
  twitterDescription: () => description,
});
</script>
