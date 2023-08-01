<template>
  <Hero bg-image="/gallery/ArtTherap1.jpg">
    <h1>
      L ' Atelier <br />
      &nbsp;de Saint-Gué
    </h1>
  </Hero>
  <Content view="fill">
    <template #media>
      <nuxt-img
        alt="Marie-Laure Barcelo Moulart"
        src="/mlmb.jpg"
        format="webp"
        loading="lazy"
        fetchpriority="low"
        width="400"
        height="600"
        sizes="sm:100vw md:50vw lg:50vw"
      />
    </template>
    <h2>L'atelier..</h2>
    <p>
      L’Atelier de St-Gué est un
      <strong>lieu de création, d’échange et de partage</strong>
      autour des arts plastiques situé en Pays Bigouden à Saint-Guénolé,
      Penmarch.
    </p>

    <h2>Venez rencontrer...</h2>
    <p>
      Marie-Laure Barcelo Moulart - artiste-mosaïste et art-thérapeute - vous
      accueille à l’Atelier pour vous initier à sa pratique artistique à travers
      des
      <NuxtLink to="/cours-et-stages">cours et stages de mosaïque</NuxtLink>
      ponctuels ou réguliers et ouverts à toutes et tous.
    </p>
  </Content>

  <Content align="left" view="fill">
    <template #media>
      <nuxt-img
        alt="Tableau"
        src="/gallery/CreationsEtCommandes/8.jpg"
        loading="lazy"
        format="webp"
        fetchpriority="low"
        width="400"
        height="600"
        sizes="sm:100vw md:50vw lg:50vw"
      />
    </template>
    <h2>L'art thérapie</h2>
    <p>
      Vous pouvez bénéficier à l’Atelier de
      <NuxtLink to="art-therapie">séances d’art thérapie</NuxtLink> : un
      accompagnement thérapeutique individualisé qui exploite votre potentiel
      artistique pour retrouver sérénité et joie de vivre.
    </p>
    <h2>La galerie</h2>
    <p>
      Visiter l’Atelier est aussi l’occasion de
      <NuxtLink to="creations-et-commandes"
        >découvrir les créations originales de Marie-Laure </NuxtLink
      >ou de lui passer une commande personnalisée.
    </p>
  </Content>

  <Divider />
  <Content class="contact" align="center" id="contact">
    <h2>Contact</h2>
    <p>
      Vous avez une question, une suggestion ou souhaitez simplement prendre
      contact ? N'hésitez pas à m'envoyer un petit mot. 🙃
    </p>

    <ContactForm class="my-5" />

    <h3>Retrouver l'Atelier</h3>

    <address class="contact__address">
      <Picto class="py-2" icon="fa-solid fa-location-dot" :size="20">
        <a href="https://goo.gl/maps/YQBsrJZ2gzBfUy3A6">
          135 Rue de la Joie, 29760 Penmarc'h
        </a>
      </Picto>
      <Picto class="py-2" icon="fa-solid fa-phone" :size="20">
        <a href="tel:+33626675883">06 26 67 58 83</a>
      </Picto>
    </address>
  </Content>
</template>
<script setup lang="ts">
const description = `L’Atelier de St-Gué est un lieu de création, d’échange et de partage autour des arts plastiques situé en Pays Bigouden à Saint-Guénolé, Penmarch.`;

useSeoMeta({
  description,
  ogDescription: description,
  twitterDescription: description,
});
</script>
<style lang="scss">
.contact {
  &__address {
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
}
</style>
