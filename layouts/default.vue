<template>
  <main class="page">
    <Navbar />
    <div class="page__content">
      <slot />
    </div>
  </main>
</template>
<style lang="scss">
.page {
  display: flex;
  flex-direction: column;

  .section:first-of-type {
    margin-top: 5rem;
  }
}
</style>
