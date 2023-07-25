<template>
  <nav class="navbar is-transparent navbar--sticky topbar">
    <div class="navbar-brand">
      <div
        class="navbar-burger"
        data-target="navmenu"
        aria-label="menu"
        aria-expanded="false"
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </div>
    </div>

    <div id="navmenu" class="navbar-menu">
      <div class="navbar-start" />
      <div class="navbar-end">
        <NuxtLink
          v-for="item in menu"
          :to="item.link"
          class="navbar-item"
          @click="closeMenu"
        >
          <span class="icon mr-2">
            <i :class="item.icon"></i>
          </span>
          {{ item.label }}
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>
<script setup lang="ts">
import {MenuItem} from "~/types/menu";

defineProps<{menu: MenuItem[]}>();

function closeMenu() {
  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(
    document.querySelectorAll(".navbar-burger"),
    0
  );

  // Add a click event on each of them
  $navbarBurgers.forEach((el) => {
    // Get the target from the "data-target" attribute
    const target = el.dataset.target;
    const $target = document.getElementById(target)!;
    // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
    el.classList.remove("is-active");
    $target.classList.remove("is-active");
  });
}

onMounted(() => {
  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(
    document.querySelectorAll(".navbar-burger"),
    0
  );

  // Add a click event on each of them
  $navbarBurgers.forEach((el) => {
    el.addEventListener("click", () => {
      // Get the target from the "data-target" attribute
      const target = el.dataset.target;
      const $target = document.getElementById(target)!;
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      el.classList.toggle("is-active");
      $target.classList.toggle("is-active");
    });
  });
});
</script>
<style lang="scss">
.navbar {
  width: 100%;
  background: transparent !important;

  &--sticky.navbar {
    position: absolute;
    top: 0;
    right: 0;
  }
}

.navbar-menu {
  position: absolute;
  top: 50px;
  left: 0;
  width: 100%;
  background: transparent;
}

.topbar {
  .navbar-item {
    color: white;
  }
}

.navbar-item {
  display: flex;
  align-items: baseline;
  font-variant-caps: petite-caps;
  font-weight: bold;
  font-size: 1.1rem;
}

@include sm {
  .navbar-menu {
    position: unset;
    top: unset;
    left: unset;
    width: unset;
  }
}
</style>
