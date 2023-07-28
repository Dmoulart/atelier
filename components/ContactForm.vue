<template>
  <form
    target="_top"
    :action="getFormAction()"
    method="get"
    enctype="text/plain"
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
</template>
<script setup lang="ts">
const props = defineProps<{mailto: string; subject: string}>();

function getFormAction() {
  return `mailto:${props.mailto}?subject:${props.subject}`;
}
</script>
