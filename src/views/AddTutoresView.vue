<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

const API_URL = 'http://localhost:3000/tutores';
const router = useRouter();
const tutor = ref({ nome: '', telefone: '' });
const salvando = ref(false);
const erro = ref('');

async function salvarTutor() {
  salvando.value = true;
  erro.value = '';

  try {
    const resposta = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tutor.value),
    });
    if (!resposta.ok) throw new Error('Não foi possível salvar o tutor.');
    await router.push({ name: 'tutoresView' });
  } catch (error) {
    erro.value = `${error.message} Verifique se o JSON Server está rodando.`;
  } finally {
    salvando.value = false;
  }
}
</script>

<template>
  <header class="mb-4">
    <h1 class="h2 fw-bold mb-1">Novo tutor</h1>
    <p class="text-body-secondary mb-0">Cadastre um tutor no sistema.</p>
  </header>

  <form
    class="row g-3"
    @submit.prevent="salvarTutor"
  >
    <p
      v-if="erro"
      class="alert alert-danger mb-0"
      role="alert"
    >
      {{ erro }}
    </p>
    <div class="col-md-6">
      <label
        for="nome"
        class="form-label"
        >Nome</label
      >
      <input
        id="nome"
        v-model.trim="tutor.nome"
        class="form-control"
        type="text"
        required
      />
    </div>
    <div class="col-md-6">
      <label
        for="telefone"
        class="form-label"
        >Telefone</label
      >
      <input
        id="telefone"
        v-model.trim="tutor.telefone"
        class="form-control"
        type="tel"
        required
      />
    </div>
    <div class="col-12 d-flex gap-2">
      <button
        class="btn btn-primary"
        type="submit"
        :disabled="salvando"
      >
        {{ salvando ? 'Salvando...' : 'Salvar tutor' }}
      </button>
      <RouterLink
        class="btn btn-outline-secondary"
        :to="{ name: 'tutoresView' }"
        >Cancelar</RouterLink
      >
    </div>
  </form>
</template>
