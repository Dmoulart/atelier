<template>
  <main class="login">
    <form class="card" @submit.prevent="submit">
      <h1>Edition</h1>
      <p class="hint">Connectez-vous pour éditer le site.</p>

      <label for="password">Mot de passe</label>
      <input
        id="password"
        type="password"
        placeholder="Votre mot de passe"
        autocomplete="current-password"
        required
        v-model="password"
      >

      <button type="submit">Envoyer</button>
    </form>
    <Toast v-model="toast" />
  </main>
</template>

<script lang="ts" setup>
import { checkLogged, login } from '~/api/api';
import Toast from '~/components/Toast.vue';

definePageMeta({
  layout: false,
  async middleware() {
    if (import.meta.client && (await checkLogged())) {
      return navigateTo('/edit')
    }
  },
})

useSeoMeta({ robots: 'noindex, nofollow' })

const password = ref('')
const toast = ref()

async function submit(){
  const logged = await login(password.value)
  if(!logged){
    toast.value = {message:'Mauvais mot de passe', success:false}
    return;
  }
  useRouter().push('/edit')
}
</script>

<style scoped>
.login {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: linear-gradient(135deg, #f5f7fa, #e4e9f2);
}
.card {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: .5rem;
  padding: 2.5rem 2rem;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgb(0 0 0 / .08);
}
h1 { margin: 0; font-size: 1.6rem; }
.hint { margin: 0 0 1rem; color: #6b7280; }
label { font-weight: 600; font-size: .9rem; }
input {
  padding: .8rem 1rem;
  font-size: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  transition: border-color .15s, box-shadow .15s;
}
input:focus {
  outline: none;
  border-color: #3273dc;
  box-shadow: 0 0 0 3px rgb(50 115 220 / .2);
}
button {
  margin-top: 1rem;
  padding: .8rem;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background: #3273dc;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  transition: background .15s;
}
button:hover { background: #2760b8; }
</style>
