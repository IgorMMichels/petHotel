<script setup>
import { onMounted, ref } from 'vue';


const API_URL = 'http://localhost:3000';

const pets = ref([]);
const tutores = ref([]);
const loading = ref(true);

async function carregarDados() {
  const respostasPets = await fetch(`${API_URL}/pets`);
  pets.value = await respostasPets.json();
  console.log('pets', pets.value);

  const respostasTutores = await fetch(`${API_URL}/tutores`);
  tutores.value = await respostasTutores.json();
  console.log('tutores:', tutores.value);

  loading.value = false;

}

function nomeTutor(tutorId) {
  for (const tutor of tutores.value) {
    if (tutor.id == tutorId) {
      return tutor.value;
    }
  }
  return 'Tutor não encontrado';
}

onMounted(carregarDados)
</script>

<template>
  <div>
    <header class="mb-4">
      <h1 class="text-2xl font-bold">Listagem de Pets</h1>
      <p class="text-body-secondary mb-0">
        Listagem dos Pets cadastrados no sistema.
      </p>
    </header>

    <RouterLink
      class="btn btn-primary"
      :to="{ name: 'addPet' }"
    >
      Adicionar Pet
    </RouterLink>
  </div>

  <table>
    <thead>
      <tr>
        <th>Nome</th>
        <th>Idade</th>
        <th>Raça</th>
        <th>Tutor</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="pet in pets" :key="pet.id">
        <td>{{ pet.id }}</td>
        <td>{{ pet.nome }}</td>
        <td>{{ pet.idade }}</td>\
        <td>{{ pet.especie }}</td>
        <td>{{ pet.tutor }}</td>
      </tr>
    </tbody>
  </table>
</template>
