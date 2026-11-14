<template>
  <NewsHero
    title="Titre de l'article"
    date="2026-11-14"
    seo-description="Un court résumé de l'article, affiché sous le titre, dans les résultats de recherche et dans la liste des actualités."
    image="/gallery/ArtTherap1.jpg"
    image-description="Une oeuvre de l'atelier de Saint-Guénolé"
  />
  <TextBlock title="Le titre de ma section 🦤">
    <p>Le début de mon super article !</p>
    <p>
      Tu peux <strong>cliquer sur cette section</strong> pour la personnaliser. Tu verras apparaître
      un petit paneau à droite qui comporte toutes les options modifiables.
    </p>
    <p>
      Tu peux cliquer dans le texte pour le modifier. Certaines zones de texte comme les titres ne
      sont modifiables que depuis le paneau.
    </p>
  </TextBlock>
  <Divider />
  <Quote
    >Lorsque une section est sélectionnée tu verras apparaître un petit bouton + en bas. Il te
    permet d'ajouter de nouvelles sections à la suite.</Quote
  >
  <Image
    image="/gallery/ArtTherap1"
    alternative-text="Un oeuvre de l'Atelier représentant des oiseaux."
  />
  <TextBlock title="Mon deuxième titre 🧀" highlight-color="#f0f8ff">
    <p>Tu peux supprimer la section sélectionnée à l'aide la poubelle en haut à droite.</p>
    <p>
      Tu peux faire remonter ou redescendre la section sélectionnée à l'aide des flêches à gauche.
    </p>
    <p>Et enfin, quand tu as finis <strong>cliquer sur Publier</strong> ! Les modifications seront effectives dans la minute.</p>
  </TextBlock>
</template>
