<template>
  <form method="POST" enctype="text/plain" @submit.prevent>
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
      <label class="label" for="message">Message</label>
      <div class="control">
        <textarea
          id="message"
          class="textarea"
          name="message"
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
</template>
<script setup lang="ts">
useHead({
  script: [
    {
      id: "ratufa_loader",
      src: "https://www.ratufa.io/c/ld.js?f=mye86exj&n=n1.ratufa.io",
    },
  ],
});
</script>
