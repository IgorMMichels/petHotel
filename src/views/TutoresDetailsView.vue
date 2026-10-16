<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

const API_URL = 'http://localhost:3000/tutores';
const route = useRoute();
const tutor = ref(null);
const carregando = ref(true);
const erro = ref('');

async function carregarTutor() {
  try {
    const resposta = await fetch(`${API_URL}/${route.params.id}`);
    if (!resposta.ok) throw new Error('Tutor não encontrado.');
    tutor.value = await resposta.json();
  } catch (error) {
    erro.value = `${error.message} Verifique se o JSON Server está rodando.`;
  } finally {
    carregando.value = false;
  }
}

onMounted(carregarTutor);
</script>

<template>
  <header class="mb-4">
    <h1 class="h2 fw-bold mb-1">Detalhes do tutor</h1>
    <p class="text-body-secondary mb-0">Dados do tutor selecionado.</p>
  </header>

  <p v-if="carregando" class="text-body-secondary" role="status">Carregando tutor...</p>
  <p v-else-if="erro" class="alert alert-danger" role="alert">{{ erro }}</p>
  <div v-else-if="tutor" class="card" style="max-width: 32rem">
    <div class="card-body">
      <p><strong>ID:</strong> {{ tutor.id }}</p>
      <p><strong>Nome:</strong> {{ tutor.nome }}</p>
      <p class="mb-4"><strong>Telefone:</strong> {{ tutor.telefone }}</p>
      <RouterLink class="btn btn-outline-secondary" :to="{ name: 'tutoresView' }">Voltar</RouterLink>
    </div>
  </div>
</template>
