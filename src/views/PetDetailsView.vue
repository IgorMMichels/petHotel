<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

const route = useRoute();
const API_URL = 'http://localhost:3000';

const pet = ref({});
const tutor = ref({});

async function carregarPet() {
  const idPet = route.params.id;
  console.log('ID do Pet:', idPet);

  const respostaPet = await fetch(`${API_URL}/pets/${idPet}`);
  pet.value = await respostaPet.json();
}

onMounted();
</script>

<template>
  <h1>Nome do pet: {{ pet.nome }}</h1>
  <p>Espécie: {{ pet.especie }}</p>

  <button class="btn btn-primary">
    <RouterLink to="{ name: 'pets' }"></RouterLink>
  </button>
</template>

<style scoped></style>
