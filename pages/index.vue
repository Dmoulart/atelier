<template>
  <Hero />
  <Content>
    <template #image>
      <figure class="image is-4-by-5">
        <img alt="Marie-Laure Moulart Barcelo" src="/mlmb.jpg" loading="lazy" />
      </figure>
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

  <Content align="left">
    <template #image>
      <figure class="image is-4-by-5">
        <img alt="Tableau" src="brush-strokes.png" loading="lazy" />
      </figure>
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

  <Content align="center">
    <h2 id="contact">Contact</h2>
    <p>
      Vous avez une question, une suggestion ou souhaitez simplement prendre
      contact ? N'hésitez pas à m'envoyer un petit mot 🙃.
    </p>

    <form
      action="mailto:dorian.moulart@gmail.com?subject=ContactArtTherapie:"
      method="get"
      enctype="text/plain"
      class="contact-form mx-auto mt-5"
    >
      <div class="field">
        <label class="label" for="email">Email</label>
        <div class="control has-icons-left has-icons-right">
          <input
            id="email"
            class="input is-medium"
            type="email"
            placeholder="Votre adresse email"
            required
          />
          <span class="icon is-medium is-left">
            <i class="fas fa-envelope"></i>
          </span>
          <span class="icon is-medium is-right">
            <i class="fas fa-check"></i>
          </span>
        </div>
      </div>

      <div class="field">
        <label class="label" for="subject">Message</label>
        <div class="control">
          <textarea
            id="subject"
            class="textarea"
            name="subject"
            placeholder="Votre message"
            required
          ></textarea>
        </div>
      </div>

      <div class="field">
        <div class="control">
          <button class="button is-link">Envoyer</button>
        </div>
      </div>
    </form>
  </Content>
</template>
<script setup lang="ts"></script>
