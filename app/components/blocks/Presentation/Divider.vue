<template>
  <div class="divider" />
</template>
<style lang="scss">
$divider-color: #d4d3d3;
.divider {
  display: block;
  position: relative;
  border-top: 0.1rem solid $divider-color;
  height: 0.1rem;
  margin: 2rem auto;
  text-align: center;
  width: 80%;
  opacity: 0.5;

  @include md {
    width: 60%;
  }
}
</style>
