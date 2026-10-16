<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';

const API_URL = 'http://localhost:3000';
const tutores = ref([]);
const carregando = ref(true);
const erro = ref('');
const pets = ref([])

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


async function removerTutor(id) {
  if (!window.confirm('Tem certeza que deseja remover este tutor?')) return;

  try {
    const resposta = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!resposta.ok) throw new Error('Não foi possível remover o tutor.');
    await carregarDados();
  } catch (error) {
    erro.value = error.message;
  }
}

onMounted(carregarDados);
</script>

<template>
  <header
    class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4"
  >
    <div>
      <h1 class="h2 fw-bold mb-1">Tutores</h1>
      <p class="text-body-secondary mb-0">Tutores cadastrados no sistema.</p>
    </div>
    <RouterLink
      class="btn btn-primary"
      :to="{ name: 'addTutores' }"
    >
      <i
        class="bi bi-plus-circle me-2"
        aria-hidden="true"
      ></i
      >Adicionar tutor
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
    Carregando tutores...
  </p>
  <div
    v-else-if="tutores.length === 0"
    class="alert alert-info"
  >
    Nenhum tutor cadastrado.
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
          <th scope="col">Telefone</th>
          <th scope="col">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="tutor in tutores"
          :key="tutor.id"
        >
          <td>{{ tutor.id }}</td>
          <td>{{ tutor.cpfCnpj }}</td>
          <td>{{ tutor.nome }}</td>
          <td>{{ tutor.telefone }}</td>
          <td>{{ tutor.email }}</td>
          <td class="text-nowrap">
            <RouterLink
              class="btn btn-sm btn-outline-primary me-2"
              :to="`/tutores/${tutor.id}`"
            >
              Visualizar
            </RouterLink>
            <button
              class="btn btn-sm btn-outline-danger"
              type="button"
              @click="removerTutor(tutor.id)"
            >
              Remover
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
