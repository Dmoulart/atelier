<template>
  <nav class="navbar is-transparent">
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
        <NuxtLink v-for="item in menu" :to="item.link" class="navbar-item">
          <span class="icon mr-1">
            <i :class="item.icon"></i>
          </span>
          {{ item.label }}
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>
<script setup lang="ts">
type MenuItem = {
  label: string;
  icon: string;
  link: string;
};

const menu: Readonly<MenuItem[]> = [
  {label: "Accueil", icon: "fas fa-home", link: "/"},
  {label: "Commandes", icon: "fa-solid fa-paintbrush", link: "/commandes"},
  {label: "Galerie", icon: "fa-solid fa-palette", link: "/galerie"},
  {
    label: "Cours de mosaïque",
    icon: "fa-solid fa-person-chalkboard",
    link: "/cours-et-stages",
  },
  {
    label: "Art thérapie",
    icon: "fa-solid fa-hand-holding-hand",
    link: "/art-therapie",
  },
  {
    label: "Contact",
    icon: "fa-solid fa-envelope",
    link: "/",
  },
];

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

<style lang="scss"></style>
