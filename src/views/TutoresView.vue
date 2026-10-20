<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';

const API_URL = 'http://localhost:3000';
const tutores = ref([]);
const carregando = ref(true);
const erro = ref('');
const pets = ref([]);
const userType = ref('CPF'); // userType == CNPJ

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
  if (!window.confirm('Deseja realmente remover este tutor?')) return;

  try {
    const respostaPets = await fetch(
      `${API_URL}/pets?tutorId=${encodeURIComponent(id)}`,
    );
    if (!respostaPets.ok)
      throw new Error('Não foi possível verificar os pets vinculados.');
    const vinculados = await respostaPets.json();
    if (vinculados.length)
      throw new Error(
        'Remova ou transfira os pets vinculados antes de remover este tutor.',
      );
    const resposta = await fetch(`${API_URL}/tutores/${id}`, {
      method: 'DELETE',
    });
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
          <th scope="col">CPF/CNPJ</th>
          <th scope="col">Telefone</th>
          <th scope="col">E-mail</th>
          <th scope="col">Pets (Qnt)</th>
          <th scope="col">Nome dos Pets</th>
          <th
            scope="col"
            class="text-right"
          >
            Ações
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="tutor in tutores"
          :key="tutor.id"
        >
          <td>{{ tutor.id }}</td>
          <td>{{ tutor.nome }}</td>
          <td v-if="userType === 'CPF'">***.***.***-**</td>
          <td v-else>**.***.***/****.**</td>
          <td>{{ tutor.telefone }}</td>
          <td>{{ tutor.email }}</td>
          <td>{{ pets.filter((pet) => pet.tutorId === tutor.id).length }}</td>
          <td v-if="pets.filter((pet) => pet.tutorId === tutor.id).length > 0">
            {{
              pets
                .filter((pet) => pet.tutorId === tutor.id)
                .map((pet) => pet.nome)
                .join(' / ')
            }}
          </td>
          <td v-else>Nenhum pet vinculado</td>
          <td class="text-nowrap">
            <RouterLink
              class="btn btn-sm bi-eye btn-outline-primary me-2"
              :to="`/tutores/${tutor.id}`"
            >
              Visualizar
            </RouterLink>
            <button
              class="btn btn-sm bi-trash btn-outline-danger"
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
