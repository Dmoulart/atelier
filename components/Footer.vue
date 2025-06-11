<template>
  <footer class="footer">
    <div class="content footer__content has-text-centered">
      <strong style="font-size: 1.1rem">Atelier de Saint-Guénolé</strong>

      <address class="footer__address mx-auto">
        <a href="https://goo.gl/maps/YQBsrJZ2gzBfUy3A6">
          135 Rue de la Joie, 29760 Penmarc'h
        </a>
        <a href="tel:+33626675883">06 26 67 58 83</a>
      </address>

      <nav class="footer__nav mt-3">
        <template v-for="(item, i) in menu">
          <NuxtLink class="footer__nav-item" :to="item.link">{{
            item.label
          }}</NuxtLink>
          {{ i !== menu.length - 1 ? "•" : "" }}
        </template>
      </nav>
    </div>
  </footer>
</template>
<script setup lang="ts">
import type { MenuItem } from "~/types/menu";

defineProps<{ menu: MenuItem[] }>();
</script>

<style lang="scss">
.footer {
  padding-bottom: 3rem !important; //override bulma  damned

  &__content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__address {
    display: flex;
    flex-flow: column wrap;
    align-items: center;
    gap: 0.5rem;
    a {
      color: black;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  &__nav {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    font-size: 1.05rem;
    font-weight: 700;
  }
}
</style>
