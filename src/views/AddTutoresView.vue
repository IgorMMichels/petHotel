<script setup>
import { computed, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

const API_URL = 'http://localhost:3000/tutores';
const router = useRouter();
const tutor = ref({
  nome: '',
  telefone: '',
  cpfCnpj: '',
  email: '',
  dataNascimento: '',
  endereco: {
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '', // uf
    cep: '',
  },
});
const salvando = ref(false);
const erro = ref('');
const mensagemObrigatorio = 'Ops, campo obrigatório, por favor preencha-o!';
const telefoneValido = computed(() =>
  /^\d{10,11}$/.test(tutor.value.telefone.replace(/\D/g, '')),
);
const emailValido = computed(
  () =>
    !tutor.value.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tutor.value.email),
);
const documentoValido = computed(
  () =>
    !tutor.value.cpfCnpj ||
    [11, 14].includes(tutor.value.cpfCnpj.replace(/\D/g, '').length),
);
const podeSalvar = computed(
  () =>
    Boolean(tutor.value.nome.trim()) &&
    telefoneValido.value &&
    emailValido.value &&
    documentoValido.value,
);

function formatarTelefone(event) {
  const numeros = event.target.value.replace(/\D/g, '').slice(0, 11);
  const tamanhoPrefixo = numeros.length > 10 ? 5 : 4;
  tutor.value.telefone =
    numeros.length <= 2
      ? numeros
      : `(${numeros.slice(0, 2)}) ${numeros.slice(2, 2 + tamanhoPrefixo)}${numeros.length > 2 + tamanhoPrefixo ? '-' + numeros.slice(2 + tamanhoPrefixo) : ''}`;
  event.target.value = tutor.value.telefone;
}

function formatarDocumento(event) {
  const numeros = event.target.value.replace(/\D/g, '').slice(0, 14);
  tutor.value.cpfCnpj =
    numeros.length <= 11
      ? numeros
          .replace(/^(\d{3})(\d)/, '$1.$2')
          .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
          .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4')
      : numeros
          .replace(/^(\d{2})(\d)/, '$1.$2')
          .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
          .replace(/\.(\d{3})(\d)/, '.$1/$2')
          .replace(/(\d{4})(\d)/, '$1-$2');
  event.target.value = tutor.value.cpfCnpj;
}

async function salvarTutor() {
  if (!podeSalvar.value || salvando.value) return;
  salvando.value = true;
  erro.value = '';

  try {
    const resposta = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...tutor.value,
        telefone: tutor.value.telefone.replace(/\D/g, ''),
        cpfCnpj: tutor.value.cpfCnpj.replace(/\D/g, ''),
      }),
    });
    if (!resposta.ok) throw new Error('Não foi possível salvar o tutor.');
    await router.push({ name: 'tutoresView' });
  } catch (error) {
    erro.value = `${error.message} Verifique se o JSON Server está rodando.`;
  } finally {
    salvando.value = false;
  }
}

async function carregaEndereco() {
  const cep = tutor.value.endereco.cep.replace(/\D/g, '');
  erro.value = '';

  if (!cep) return;

  if (cep.length !== 8) {
    erro.value = 'Informe um CEP com 8 dígitos.';
    return;
  }

  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (!resposta.ok) throw new Error('Não foi possível consultar o CEP.');

    const data = await resposta.json();
    if (cep !== tutor.value.endereco.cep.replace(/\D/g, '')) return;

    if (data.erro) {
      erro.value = 'CEP não encontrado.';
      return;
    }

    Object.assign(tutor.value.endereco, {
      rua: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade,
      estado: data.uf,
    });
  } catch {
    if (cep !== tutor.value.endereco.cep.replace(/\D/g, '')) return;
    erro.value = 'Erro ao consultar o CEP. Tente novamente.';
  }
}
</script>

<template>
  <header class="mb-4">
    <h1 class="h2 fw-bold mb-1">Novo tutor</h1>
    <p class="text-body-secondary mb-0">Cadastre um tutor no sistema.</p>
  </header>
  <div class="p-3">
    <h3 class="fw-bold">Dados do Tutor</h3>
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
          >Nome completo</label
        >
        <input
          id="nome"
          aria-describedby="nome-erro"
          required
          v-model.trim="tutor.nome"
          class="form-control"
          type="text"
          placeholder="Digite o nome completo do tutor"
        />
        <p
          v-if="!tutor.nome.trim()"
          id="nome-erro"
          class="text-danger small mt-1 mb-0"
        >
          {{ mensagemObrigatorio }}
        </p>
      </div>
      <div class="col-md-6">
        <label
          for="telefone"
          class="form-label"
          >Telefone</label
        >
        <input
          id="telefone"
          aria-describedby="telefone-erro"
          required
          :value="tutor.telefone"
          @input="formatarTelefone"
          class="form-control"
          type="tel"
          placeholder="Digite o telefone do tutor"
        />
        <p
          v-if="!tutor.telefone.trim()"
          id="telefone-erro"
          class="text-danger small mt-1 mb-0"
        >
          {{ mensagemObrigatorio }}
        </p>
        <p
          v-else-if="!telefoneValido"
          class="text-danger small mt-1 mb-0"
        >
          Informe o DDD e um telefone com 10 ou 11 dígitos.
        </p>
      </div>
      <div class="col-md-6">
        <label
          for="cpfCnpj"
          class="form-label"
          >CPF / CNPJ</label
        >
        <input
          id="cpfCnpj"
          aria-describedby="cpfCnpj-erro"
          :value="tutor.cpfCnpj"
          @input="formatarDocumento"
          class="form-control"
          type="text"
          placeholder="Digite o CPF ou CNPJ"
        />
        <p
          v-if="!documentoValido"
          id="cpfCnpj-erro"
          class="text-danger small mt-1 mb-0"
        >
          Informe um CPF com 11 dígitos ou CNPJ com 14 dígitos.
        </p>
      </div>
      <div class="col-md-6">
        <label
          for="dataNascimento"
          class="form-label"
          >Data de Nascimento</label
        >
        <input
          id="dataNascimento"
          v-model.trim="tutor.dataNascimento"
          class="form-control"
          type="date"
        />
      </div>
      <div class="col-md-12">
        <label
          for="email"
          class="form-label"
          >E-mail</label
        >
        <input
          id="email"
          aria-describedby="email-erro"
          v-model.trim="tutor.email"
          class="form-control"
          placeholder="nome@example.com"
          type="email"
        />
        <p
          v-if="!emailValido"
          id="email-erro"
          class="text-danger small mt-1 mb-0"
        >
          Informe um e-mail válido.
        </p>
      </div>

      <h3 class="fw-bold">Endereço</h3>
      <div class="col-md-8">
        <label
          for="rua"
          class="form-label"
          >Rua</label
        >
        <input
          id="rua"
          v-model.trim="tutor.endereco.rua"
          class="form-control"
          type="text"
          placeholder="Digite o nome da rua"
        />
      </div>
      <div class="col-md-4">
        <label
          for="numero"
          class="form-label"
          >Número</label
        >
        <input
          id="numero"
          v-model.trim="tutor.endereco.numero"
          class="form-control"
          type="text"
          placeholder="Número"
        />
      </div>
      <div class="col-md-6">
        <label
          for="bairro"
          class="form-label"
          >Bairro</label
        >
        <input
          id="bairro"
          v-model.trim="tutor.endereco.bairro"
          class="form-control"
          placeholder="Digite o bairro"
          type="text"
        />
      </div>
      <div class="col-md-6">
        <label
          for="cidade"
          class="form-label"
          >Cidade</label
        >
        <input
          id="cidade"
          v-model.trim="tutor.endereco.cidade"
          class="form-control"
          placeholder="Digite a cidade"
          type="text"
        />
      </div>
      <div class="col-md-6">
        <label
          for="estado"
          class="form-label"
          >Estado</label
        >
        <select
          id="estado"
          v-model.trim="tutor.endereco.estado"
          class="form-select"
          placeholder="Selecione"
        >
          <option
            value=""
            disabled
            selected
          >
            Selecione
          </option>
          <option value="AC">Acre</option>
          <option value="AL">Alagoas</option>
          <option value="AP">Amapá</option>
          <option value="AM">Amazonas</option>
          <option value="BA">Bahia</option>
          <option value="CE">Ceará</option>
          <option value="DF">Distrito Federal</option>
          <option value="ES">Espírito Santo</option>
          <option value="GO">Goiás</option>
          <option value="MA">Maranhão</option>
          <option value="MT">Mato Grosso</option>
          <option value="MS">Mato Grosso do Sul</option>
          <option value="MG">Minas Gerais</option>
          <option value="PA">Pará</option>
          <option value="PB">Paraíba</option>
          <option value="PR">Paraná</option>
          <option value="PE">Pernambuco</option>
          <option value="PI">Piauí</option>
          <option value="RJ">Rio de Janeiro</option>
          <option value="RN">Rio Grande do Norte</option>
          <option value="RS">Rio Grande do Sul</option>
          <option value="RO">Rondônia</option>
          <option value="RR">Roraima</option>
          <option value="SC">Santa Catarina</option>
          <option value="SP">São Paulo</option>
          <option value="SE">Sergipe</option>
        </select>
      </div>
      <div class="col-md-6">
        <label
          for="cep"
          class="form-label"
          >CEP</label
        >
        <input
          id="cep"
          v-model.trim="tutor.endereco.cep"
          class="form-control"
          type="text"
          placeholder="00000-000"
          @blur="carregaEndereco"
        />
      </div>
      <div class="col-12 d-flex gap-2">
        <button
          class="btn btn-primary"
          type="submit"
          :disabled="salvando || !podeSalvar"
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
  </div>
</template>
