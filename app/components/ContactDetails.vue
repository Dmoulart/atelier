<template>
  <address class="contact-details">
    <slot />
  </address>
</template>
<style lang="scss">
.contact-details {
  display: flex;
  flex-flow: column nowrap;
  gap: 2rem;
  font-size: 1.2rem;

  .picto {
    margin-inline: auto;
  }

  @include sm {
    flex-flow: row nowrap;
    justify-content: center;

    .picto {
      margin-inline: initial;
    }
  }
}
</style>
