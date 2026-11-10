<template>
  <Seo
    title="Créations et commandes - Atelier de St-Gué"
    description="L’atelier vous propose des créations personnelles comme du mobilier, de l’art de la table, des tableaux, des fresques intérieures et extérieures. Toutes vos envies ou projets personnels peuvent être réalisés avec un devis sur mesure."
  />
  <Hero background-image="/gallery/Commandes/poissonSculture.jpg">
    <h1>Créations et commandes</h1>
  </Hero>

  <Content>
    <h2>Des œuvres personnalisées</h2>
    <p>
      L’atelier vous propose des créations personnelles comme du mobilier, de l’art de la table, des
      tableaux, des fresques intérieures et extérieures. Toutes vos envies ou projets personnels
      peuvent être réalisés avec un devis sur mesure. Pour toute information supplémentaire,
      <NuxtLink to="/#contact">contacter l’Atelier.</NuxtLink>
    </p>
    <Slider
      class="my-5"
      :images='[
        {"src": "/gallery/CreationsEtCommandes/1.jpg", "caption": "Numéro de maison 29 : Numéro de maison sur filet à coller"},
        {"src": "/gallery/CreationsEtCommandes/2.jpg", "caption": "Sculptures de la mer, réalisation en bois flotté"},
        {"src": "/gallery/CreationsEtCommandes/3.jpg", "caption": "Miroir vitrail et fond béton"},
        {"src": "/gallery/CreationsEtCommandes/4.jpg", "caption": "Coupe émaux et pâte de verre"},
        {"src": "/gallery/CreationsEtCommandes/5.jpg", "caption": "L&#39;Oiseau ; ardoise, grès et verre"},
        {"src": "/gallery/CreationsEtCommandes/6.jpg", "caption": "Le Duo ; émaux et pâte de verre"},
        {"src": "/gallery/CreationsEtCommandes/7.jpg", "caption": "Arbre de vie ; inspiré par Klimt, fond béton et pluie de miroirs"},
        {"src": "/gallery/CreationsEtCommandes/8.jpg", "caption": "La Petite Bretonne ; vitrail et ardoise"},
        {"src": "/gallery/CreationsEtCommandes/9.jpg", "caption": "Console sur pieds en fonte, ancienne machine à coudre, inspiration Odorico"},
        {"src": "/gallery/CreationsEtCommandes/10.jpg", "caption": "Console sur pieds en fonte, ancienne machine à coudre, inspiration Odorico"},
        {"src": "/gallery/CreationsEtCommandes/11.jpg", "caption": "Console sur pieds en fonte, ancienne machine à coudre, inspiration Odorico"},
        {"src": "/gallery/CreationsEtCommandes/12.jpg", "caption": "Faïence ancienne, travail pique assiette"}
      ]'
    />
  </Content>
</template>
