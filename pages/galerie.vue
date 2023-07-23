<template>
  <Content centered>
    <h2>Créations sur commande</h2>
    <p>
      L’atelier vous propose des
      <strong> créations personnelles </strong> comme du mobilier, de l’art de
      la table, des tableaux, des fresques intérieures et extérieures. Toutes
      vos envies ou projets personnels peuvent être réalisés avec un devis sur
      mesure. Pour toute information supplémentaire,
      <NuxtLink to="/#contact">contacter</NuxtLink> l’Atelier.
    </p>
  </Content>
  <Section>
    <Gallery :images="['']" />
  </Section>
</template>
<script setup lang="ts"></script>
