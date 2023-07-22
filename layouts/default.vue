<template>
  <main class="page">
    <Navbar />
    <slot />
  </main>
</template>
<style lang="scss">
.page {
  display: flex;
  flex-direction: column;
}
</style>
