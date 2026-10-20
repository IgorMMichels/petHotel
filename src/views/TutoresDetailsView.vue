<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';

const API_URL = 'http://localhost:3000';
const route = useRoute();
const router = useRouter();
const carregando = ref(true);
const erro = ref('');
const tutor = ref(null);
const pets = ref([]);
const removendo = ref(false);
const erroRemocao = ref('');
const novoPet = ref({ nome: '', especie: '' });
const salvandoPet = ref(false);
const erroPet = ref('');

async function carregarPets() {
  const resposta = await fetch(
    `${API_URL}/pets?tutorId=${encodeURIComponent(route.params.id)}`,
  );
  if (!resposta.ok)
    throw new Error('Não foi possível carregar os pets vinculados.');
  pets.value = await resposta.json();
}

async function salvarPet() {
  if (
    salvandoPet.value ||
    removendo.value ||
    !novoPet.value.nome.trim() ||
    !novoPet.value.especie.trim()
  )
    return;
  salvandoPet.value = true;
  erroPet.value = '';
  try {
    const resposta = await fetch(`${API_URL}/pets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: novoPet.value.nome.trim(),
        especie: novoPet.value.especie.trim(),
        tutorId: route.params.id,
      }),
    });
    if (!resposta.ok) throw new Error('Não foi possível cadastrar o pet.');
    const pet = await resposta.json();
    pets.value.push(pet);
    novoPet.value = { nome: '', especie: '' };
  } catch (error) {
    erroPet.value = error.message;
  } finally {
    salvandoPet.value = false;
  }
}

async function carregarDados() {
  carregando.value = true;
  erro.value = '';

  try {
    const resposta = await fetch(`${API_URL}/tutores/${route.params.id}`);
    if (!resposta.ok) {
      throw new Error(
        resposta.status === 404
          ? 'Tutor não encontrado.'
          : 'Não foi possível carregar os dados.',
      );
    }
    tutor.value = await resposta.json();
    await carregarPets();
  } catch (error) {
    erro.value = `${error.message} Verifique se o JSON Server está rodando.`;
  } finally {
    carregando.value = false;
  }
}

async function removerTutor() {
  if (removendo.value || salvandoPet.value) return;
  if (!window.confirm('Deseja realmente remover este tutor?')) return;

  removendo.value = true;
  erroRemocao.value = '';
  try {
    await carregarPets();
    if (pets.value.length)
      throw new Error(
        'Remova ou transfira os pets vinculados antes de remover este tutor.',
      );
    const resposta = await fetch(`${API_URL}/tutores/${tutor.value.id}`, {
      method: 'DELETE',
    });
    if (!resposta.ok) throw new Error('Não foi possível remover o tutor.');
    await router.push({ name: 'tutoresView' });
  } catch (error) {
    erroRemocao.value = error.message;
  } finally {
    removendo.value = false;
  }
}

onMounted(carregarDados);
</script>

<template>
  <header class="mb-4 d-flex flex-wrap justify-content-between gap-3">
    <div>
      <h1 class="h2 fw-bold mb-1">Detalhes do tutor</h1>
      <p class="text-body-secondary mb-0">Dados do tutor selecionado.</p>
    </div>
    <div>
      <RouterLink
        class="btn btn-primary bi-arrow-left"
        :to="{ name: 'tutoresView' }"
        >Voltar para Tutores
      </RouterLink>
    </div>
  </header>

  <p
    v-if="carregando"
    class="text-body-secondary"
    role="status"
  >
    Carregando tutor...
  </p>
  <p
    v-else-if="erro"
    class="alert alert-danger"
    role="alert"
  >
    {{ erro }}
  </p>
  <div
    v-else-if="tutor"
    class="d-grid gap-3"
  >
    <section class="card">
      <h2 class="card-header h6 mb-0">Dados do Tutor</h2>
      <div class="card-body">
        <div class="row g-3 mb-4">
          <div class="col-12 col-md-4">
            <p class="mb-0"><strong>ID:</strong> {{ tutor.id }}</p>
          </div>
          <div class="col-12 col-md-4">
            <p class="mb-0 text-break">
              <strong>Nome:</strong> {{ tutor.nome }}
            </p>
          </div>
          <div class="col-12 col-md-4">
            <p class="mb-0 text-break">
              <strong>Telefone:</strong> {{ tutor.telefone }}
            </p>
          </div>
          <div class="col-12 col-md-4">
            <p class="mb-0 text-break">
              <strong>E-mail:</strong> {{ tutor.email }}
            </p>
          </div>
          <div class="col-12 col-md-4">
            <p class="mb-0">
              <strong>Data de Nascimento:</strong> {{ tutor.dataNascimento }}
            </p>
          </div>
          <div class="col-12 col-md-4">
            <p class="mb-0 text-break">
              <strong>Cpf/Cnpj:</strong> {{ tutor.cpfCnpj }}
            </p>
          </div>
        </div>
      </div>
    </section>
    <section class="card">
      <h2 class="card-header h6 mb-0">Endereço</h2>
      <div class="card-body">
        <div class="row g-3">
          <div class="col-12 col-md-4">
            <strong class="d-block">Rua</strong>
            <span class="text-break">{{ tutor.endereco?.rua }}</span>
          </div>
          <div class="col-12 col-md-4">
            <strong class="d-block">Número</strong>
            <span class="text-break">{{ tutor.endereco?.numero }}</span>
          </div>
          <div class="col-12 col-md-4">
            <strong class="d-block">Bairro</strong>
            <span class="text-break">{{ tutor.endereco?.bairro }}</span>
          </div>
          <div class="col-12 col-md-4">
            <strong class="d-block">Cidade</strong>
            <span class="text-break">{{ tutor.endereco?.cidade }}</span>
          </div>
          <div class="col-12 col-md-4">
            <strong class="d-block">Estado</strong>
            <span class="text-break">{{ tutor.endereco?.estado }}</span>
          </div>
          <div class="col-12 col-md-4">
            <strong class="d-block">CEP</strong>
            <span class="text-break">{{ tutor.endereco?.cep }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="card">
      <h2 class="card-header h6 mb-0 d-flex align-items-center gap-2">
        Pets vinculados
        <span class="badge rounded-pill text-bg-primary">
          {{ pets.length }} {{ pets.length === 1 ? 'pet' : 'pets' }}
        </span>
      </h2>
      <div
        v-if="pets.length"
        class="table-responsive"
      >
        <table class="table table-striped table-hover align-middle mb-0">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Nome</th>
              <th scope="col">Espécie</th>
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
              <td>
                <RouterLink
                  class="btn btn-sm btn-outline-primary text-nowrap"
                  :to="{ name: 'detalhePet', params: { id: pet.id } }"
                  >Visualizar Pet</RouterLink
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p
        v-else
        class="card-body mb-0 text-body-secondary"
      >
        Nenhum pet vinculado a este tutor.
      </p>
    </section>

    <section class="card">
      <h2 class="card-header h6 mb-0">Cadastrar pet para este tutor</h2>
      <form
        class="card-body row g-3"
        @submit.prevent="salvarPet"
      >
        <p
          v-if="erroPet"
          class="alert alert-danger"
          role="alert"
        >
          {{ erroPet }}
        </p>
        <div class="col-12 col-md-6">
          <label
            for="nome-pet"
            class="form-label"
            >Nome do pet</label
          >
          <input
            id="nome-pet"
            v-model.trim="novoPet.nome"
            class="form-control"
            required
          />
        </div>
        <div class="col-12 col-md-6">
          <label
            for="especie-pet"
            class="form-label"
            >Espécie</label
          >
          <input
            id="especie-pet"
            v-model.trim="novoPet.especie"
            class="form-control"
            required
          />
        </div>
        <div class="col-12">
          <button
            class="btn btn-primary"
            type="submit"
            :disabled="
              salvandoPet ||
              removendo ||
              !novoPet.nome.trim() ||
              !novoPet.especie.trim()
            "
          >
            {{ salvandoPet ? 'Salvando...' : 'Salvar pet' }}
          </button>
        </div>
      </form>
    </section>

    <p
      v-if="erroRemocao"
      class="alert alert-danger mb-0"
      role="alert"
    >
      {{ erroRemocao }}
    </p>
    <div>
      <button
        class="btn btn-outline-danger"
        type="button"
        :disabled="removendo || salvandoPet"
        @click="removerTutor"
      >
        {{ removendo ? 'Removendo...' : 'Remover Tutor' }}
      </button>
    </div>
  </div>
</template>
