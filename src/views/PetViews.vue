<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';

const API_URL = 'http://localhost:3000';
const pets = ref([]);
const tutores = ref([]);
const carregando = ref(true);
const erro = ref('');



async function carregarDados() {
  carregando.value = true;
  erro.value = '';

  try {
    const [respostaPets, respostaTutores] = await Promise.all([
      fetch(`${API_URL}/pets`),
      fetch(`${API_URL}/tutores`),
    ]);
    if (!respostaPets.ok || !respostaTutores.ok) {
      throw new Error('Não foi possível carregar os dados.');
    }
    pets.value = await respostaPets.json();
    tutores.value = await respostaTutores.json();
  } catch (error) {
    erro.value = `${error.message} Verifique se o JSON Server está rodando.`;
  } finally {
    carregando.value = false;
  }
}

function nomeTutor(tutorId) {
  return (
    tutores.value.find((tutor) => tutor.id == tutorId)?.nome ??
    'Tutor não encontrado'
  );
}

onMounted(carregarDados);
</script>

<template>
  <header
    class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4"
  >
    <div>
      <h1 class="h2 fw-bold mb-1">Pets</h1>
      <p class="text-body-secondary mb-0">Pets cadastrados no sistema.</p>
    </div>
    <RouterLink
      class="btn btn-primary"
      :to="{ name: 'addPet' }"
    >
      <i
        class="bi bi-plus-circle me-2"
        aria-hidden="true"
      ></i
      >Adicionar pet
    </RouterLink>
  </header>

  <p
    v-if="erro"
    class="alert alert-danger"
    role="alert"
  >
    {{ erro }}
  </p>
  <p
    v-else-if="carregando"
    class="text-body-secondary"
    role="status"
  >
    Carregando pets...
  </p>
  <div
    v-else-if="pets.length === 0"
    class="alert alert-info"
  >
    Nenhum pet cadastrado.
  </div>
  <div
    v-else
    class="table-responsive"
  >
    <table class="table table-striped table-hover align-middle">
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Nome</th>
          <th scope="col">Espécie</th>
          <th scope="col">Tutor</th>
          <th scope="col">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="pet in pets"
          :key="pet.id"
        >
          <td>{{ pet.id }}</td>
          <td>{{ pet.nome }}</td>
          <td>{{ pet.especie }}</td>
          <td>{{ nomeTutor(pet.tutorId) }}</td>
          <td>
            <RouterLink
              class="btn btn-sm btn-outline-primary"
              :to="`/pets/${pet.id}`"
            >
              Visualizar
            </RouterLink>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
