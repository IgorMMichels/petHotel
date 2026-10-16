<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

const API_URL = 'http://localhost:3000';
const route = useRoute();
const pet = ref(null);
const tutor = ref(null);
const carregando = ref(true);
const erro = ref('');

async function carregarPet() {
  try {
    const respostaPet = await fetch(`${API_URL}/pets/${route.params.id}`);
    if (!respostaPet.ok) throw new Error('Pet não encontrado.');
    pet.value = await respostaPet.json();

    if (pet.value.tutorId) {
      const respostaTutor = await fetch(
        `${API_URL}/tutores/${pet.value.tutorId}`,
      );
      if (respostaTutor.ok) tutor.value = await respostaTutor.json();
    }
  } catch (error) {
    erro.value = `${error.message} Verifique se o JSON Server está rodando.`;
  } finally {
    carregando.value = false;
  }
}

onMounted(carregarPet);
</script>

<template>
  <header class="mb-4">
    <h1 class="h2 fw-bold mb-1">Detalhes do pet</h1>
    <p class="text-body-secondary mb-0">Dados do pet selecionado.</p>
  </header>

  <p
    v-if="carregando"
    class="text-body-secondary"
    role="status"
  >
    Carregando pet...
  </p>
  <p
    v-else-if="erro"
    class="alert alert-danger"
    role="alert"
  >
    {{ erro }}
  </p>
  <div
    v-else-if="pet"
    class="card"
    style="max-width: 32rem"
  >
    <div class="card-body">
      <p><strong>ID:</strong> {{ pet.id }}</p>
      <p><strong>Nome:</strong> {{ pet.nome }}</p>
      <p><strong>Espécie:</strong> {{ pet.especie }}</p>
      <p class="mb-4">
        <strong>Tutor:</strong> {{ tutor?.nome ?? 'Tutor não encontrado' }}
      </p>
      <RouterLink
        class="btn btn-outline-secondary"
        :to="{ name: 'petsView' }"
      >
        Voltar
      </RouterLink>
    </div>
  </div>
</template>
