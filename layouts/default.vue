<template>
  <main class="page">
    <Navbar />
    <div class="page__content">
      <slot />
    </div>
  </main>
</template>
<style lang="scss">
// $first-section-margin-top: 8rem;
.page {
  display: flex;
  flex-direction: column;

  --first-section-mt: 2rem;
  @include sm {
    --first-section-mt: 8rem;
  }

  .section:first-of-type {
    margin-top: var(--first-section-mt);
    min-height: calc($section-min-height - var(--first-section-mt));
  }
}
</style>
