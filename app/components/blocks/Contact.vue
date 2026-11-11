<template>
  <Content id="contact" align="center">
    <h2>{{ title }}</h2>
    <slot />

    <ContactForm v-if="showForm" />

    <h3 class="mt-5">Retrouver l'Atelier</h3>
    <ContactDetails>
      <Picto class="py-2" icon="fa-solid fa-location-dot" :size="20">
        <a :href="mapsUrl">{{ address }}</a>
      </Picto>
      <Picto class="py-2" icon="fa-solid fa-phone" :size="20">
        <a :href="phoneHref">{{ phone }}</a>
      </Picto>
    </ContactDetails>
  </Content>
</template>
<script setup lang="ts">
const { phone, showForm = true } = defineProps<{
  title: string
  address: string
  mapsUrl: string
  phone: string
  showForm?: boolean
}>()

const phoneHref = computed(() => `tel:${(phone ?? '').replace(/\s/g, '').replace(/^0/, '+33')}`)
</script>
