<template>
  <main class="page">
    <Navbar />
    <div class="page__content">
      <slot />
    </div>
  </main>
</template>
<style lang="scss">
$first-section-margin-top: 8rem;
.page {
  display: flex;
  flex-direction: column;

  .section:first-of-type {
    margin-top: $first-section-margin-top;
    min-height: calc(100vh - $first-section-margin-top);
  }
}
</style>
