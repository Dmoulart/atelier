<template>
  <Hero />
  <Content centered>
    <template #image>
      <nuxt-img
        alt="Marie-Laure Moulart Barcelo"
        src="/mlmb.jpg"
        format="webp"
        loading="lazy"
      />
    </template>
    <h2>Venez rencontrer...</h2>
    <p>
      Marie-Laure Moulart-Barcelo - artiste-mosaïste et art-thérapeute - vous
      accueille à l’Atelier pour vous initier à sa pratique artistique à travers
      des cours et stages de mosaïque ponctuels ou réguliers et ouverts à toutes
      et tous.
    </p>

    <h2>L'atelier..</h2>
    <p>
      L’Atelier de St-Gué est un lieu de création, d’échange et de partage
      autour des arts plastiques situé en Pays Bigouden à Saint-Guénolé,
      Penmarch.
    </p>
  </Content>

  <Content align="left" centered>
    <template #image>
      <nuxt-img
        alt="Tableau"
        format="webp"
        src="/brush-strokes.png"
        loading="lazy"
        width="500"
        height="600"
      />
    </template>
    <h2>La galerie</h2>
    <p>
      Visiter l’Atelier est aussi l’occasion de découvrir les
      <NuxtLink to="galerie"> créations originales de Marie-Laure</NuxtLink> ou
      de lui passer une commande personnalisée.
    </p>
    <h2>L'art thérapie</h2>
    <p>
      Vous pouvez bénéficier à l’Atelier de
      <NuxtLink to="art-therapie">séances d’art thérapie</NuxtLink> : un
      accompagnement thérapeutique individualisé qui exploite votre potentiel
      artistique pour retrouver sérénité et joie de vivre.
    </p>
  </Content>

  <Content align="center" centered>
    <h2 id="contact">Contact</h2>
    <p>
      Vous avez une question, une suggestion ou souhaitez simplement prendre
      contact ? N'hésitez pas à m'envoyer un petit mot 🙃.
    </p>
    <ContactForm
      mailto="dorian.moulart@gmail.com"
      :subject="`L'atelier de St-Gué`"
      class="mt-5"
    />
  </Content>
</template>
<script setup lang="ts"></script>
