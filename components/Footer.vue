<template>
  <footer class="footer">
    <div class="content has-text-centered">
      <p>
        <strong>Atelier de Saint-Guénolé</strong>
      </p>
      <address>125 Rue de la Joie, 29760 Penmarc'h</address>

      <nav class="footer__nav">
        <NuxtLink
          v-for="(item, i) in menu"
          :to="item.link"
          :key="i"
          class="navbar-item"
          >{{ item.label }}</NuxtLink
        >
      </nav>
    </div>
  </footer>
</template>
<script setup lang="ts">
import {MenuItem} from "~/types/menu";

defineProps<{menu: MenuItem[]}>();
</script>

<style lang="scss">
.footer {
  padding-bottom: 3rem !important; //override bulma  damned
  &__nav {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
  }
}
</style>
