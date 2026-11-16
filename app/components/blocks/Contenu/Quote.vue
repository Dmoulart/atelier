<template>
  <Content align="center">
    <blockquote><slot /></blockquote>
  </Content>
</template>
<style lang="scss">
// empty in the editor: same placeholder as the Text block
.tr-root blockquote:empty:before {
  content: '💬 Écrire la citation ici…';
  font-style: italic;
  color: #b3aba2;
}
</style>
<transient>
  {
    "thumbnail": "/blocks/Quote.svg"
  }
</transient>
