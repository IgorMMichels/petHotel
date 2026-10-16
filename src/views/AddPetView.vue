<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

const API_URL = 'http://localhost:3000';
const router = useRouter();
const novoPet = ref({ nome: '', especie: '', tutorId: '' });
const tutores = ref([]);
const carregandoTutores = ref(true);
const salvando = ref(false);
const erro = ref('');

async function carregarTutores() {
  erro.value = '';
  try {
    const resposta = await fetch(`${API_URL}/tutores`);
    if (!resposta.ok) throw new Error('Não foi possível carregar os tutores.');
    tutores.value = await resposta.json();
  } catch (error) {
    erro.value = `${error.message} Verifique se o JSON Server está rodando.`;
  } finally {
    carregandoTutores.value = false;
  }
}

async function salvarPet() {
  salvando.value = true;
  erro.value = '';
  try {
    const resposta = await fetch(`${API_URL}/pets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoPet.value),
    });
    if (!resposta.ok) throw new Error('Não foi possível salvar o pet.');
    await router.push({ name: 'petsView' });
  } catch (error) {
    erro.value = `${error.message} Verifique se o JSON Server está rodando.`;
  } finally {
    salvando.value = false;
  }
}

onMounted(carregarTutores);
</script>

<template>
  <header class="mb-4">
    <h1 class="h2 fw-bold mb-1">Novo pet</h1>
    <p class="text-body-secondary mb-0">Cadastre um pet no sistema.</p>
  </header>

  <p
    v-if="erro"
    class="alert alert-danger"
    role="alert"
  >
    {{ erro }}
  </p>
  <p
    v-else-if="carregandoTutores"
    class="text-body-secondary"
    role="status"
  >
    Carregando tutores...
  </p>
  <div
    v-else-if="tutores.length === 0"
    class="alert alert-warning"
    role="alert"
  >
    Cadastre um tutor antes de adicionar um pet.
  </div>

  <form
    v-else
    class="row g-3"
    @submit.prevent="salvarPet"
  >
    <div class="col-md-6">
      <label
        for="nome"
        class="form-label"
        >Nome do pet</label
      >
      <input
        id="nome"
        v-model.trim="novoPet.nome"
        class="form-control"
        type="text"
        required
      />
    </div>
    <div class="col-md-6">
      <label
        for="especie"
        class="form-label"
        >Espécie</label
      >
      <select
        id="especie"
        v-model="novoPet.especie"
        class="form-select"
        required
      >
        <option
          value=""
          disabled
        >
          Selecione a espécie
        </option>
        <option value="Cachorro">Cachorro</option>
        <option value="Gato">Gato</option>
      </select>
    </div>
    <div class="col-md-6">
      <label
        for="tutor"
        class="form-label"
        >Tutor</label
      >
      <select
        id="tutor"
        v-model="novoPet.tutorId"
        class="form-select"
        required
      >
        <option
          value=""
          disabled
        >
          Selecione o tutor
        </option>
        <option
          v-for="tutor in tutores"
          :key="tutor.id"
          :value="tutor.id"
        >
          {{ tutor.nome }}
        </option>
      </select>
    </div>
    <div class="col-12 d-flex gap-2">
      <button
        class="btn btn-primary"
        type="submit"
        :disabled="salvando"
      >
        {{ salvando ? 'Salvando...' : 'Salvar pet' }}
      </button>
      <RouterLink
        class="btn btn-outline-secondary"
        :to="{ name: 'petsView' }"
      >
        Cancelar
      </RouterLink>
    </div>
  </form>
</template>
