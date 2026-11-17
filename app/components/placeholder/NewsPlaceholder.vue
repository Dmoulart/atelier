<template>
  <NewsHero
    :seo="{description:'Un court résumé de l\'article, affiché sous le titre, dans les résultats de recherche et dans la liste des actualités.',imageDescription:'Une oeuvre de l\'atelier de Saint-Guénolé'}"
    title="Titre de l'article"
    date="2026-11-14"
    image="/gallery/ArtTherap1.jpg"
  />
  <TextAndImage
    title="Le titre de ma section 🦤"
    media="/gallery/Rougegorge.jpg"
    media-alt="Une photo de l'atelier"
  >
    <p>Le début de mon super article !</p>
    <p>
      Tu peux <strong>cliquer sur cette section</strong> pour la personnaliser. Tu verras apparaître
      un petit paneau à droite qui comporte toutes les options modifiables.
    </p>
  </TextAndImage>
  <Text highlight-color="#f0f8ff"
    ><p>
      Tu peux <b>cliquer dans le texte</b> pour le modifier. Certaines zones de texte comme les
      titres ne sont modifiables que depuis le paneau.
    </p></Text
  >
  <TextAndImage
    title="Mon deuxième titre 🧀"
    media="/gallery/CreationsEtCommandes/8.jpg"
    media-alt="Une oeuvre de l'atelier"
    media-side="left"
  >
    <p>
      Lorsque une section est sélectionnée tu verras apparaître un petit bouton + en bas. Il te
      permet d'ajouter de nouvelles sections à la suite.
    </p>
    <p>Tu peux supprimer la section sélectionnée à l'aide la poubelle en haut à droite.</p>
    <p>
      Tu peux faire remonter ou redescendre la section sélectionnée à l'aide des flêches à gauche.
    </p>
  </TextAndImage>
  <Divider />
  <Quote
    >Et enfin, quand tu as finis tu peux <strong>cliquer sur Publier</strong> ! Les modifications
    seront effectives dans la minute.</Quote
  >
  <Image
    image="/gallery/ArtTherap1.jpg"
    alternative-text="Un oeuvre de l'Atelier représentant des oiseaux."
  />
  <Text
    title="Envie de participer ?"
    title-size="small"
    highlight-color="#f2ebe2"
    link-label="Me contacter"
    link-url="/#contact"
  />
  <News title="Les autres actualités de l'atelier" />
</template>
