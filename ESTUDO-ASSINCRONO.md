# Atividade Estudo Requisições Assíncronas em JavaScript

_Igor Marcon Michels_
<br>
_2INFO1_

## Parte 1

### 1. O que é uma função assíncrona? Por que buscar dados de uma API é uma operação assíncrona?

Uma função assíncrona é uma função que pode esperar alguma coisa terminar sem travar o resto da aplicação. Buscar dados de uma API é assíncrono porque a resposta não vem na mesma hora. Depende do servidor, da conexão e também do tempo que ele leva pra responder. Enquanto isso o JavaScript consegue continuar executando outras partes da página, então o site não fica simplesmente parado esperando.

### 2. O que é uma Promise? O que significam os estados pending, fulfilled e rejected?

Uma Promise representa uma operação que ainda vai ter um resultado. Ela pode ficar no estado pending, quando ainda está esperando terminar, __fulfilled__, quando terminou e deu certo, ou __rejected__, quando aconteceu algum erro. Um exemplo é o __fetch()__, porque quando ele é chamado os dados não chegam na mesma hora, então ele retorna uma Promise e depois recebe o resultado.

### 3. Para que servem async e await? O que acontece com a execução da função enquanto ela aguarda uma resposta?

O __async__ serve para indicar que uma função vai trabalhar com operações assíncronas e o __await__ serve para esperar uma dessas operações terminar antes de continuar o código daquela função. Enquanto o __await__ está esperando, a função fica parada naquele ponto, mas isso não trava o JavaScript inteiro, então outras partes da aplicação continuam funcionando normalmente.

### 4. O que a Fetch API faz? Qual é a diferença entre fetch(url) e resposta.json()?

A Fetch API serve para fazer requisições usando JavaScript. O __fetch(url)__ faz a requisição para o endereço informado e espera uma resposta do servidor. Já o __resposta.json()__ pega o conteúdo que veio nessa resposta e transforma em um formato que conseguimos usar no JavaScript. Então basicamente o __fetch()__ busca a resposta e o __json()__ pega os dados dessa resposta.

### 5. Como podemos tratar um erro quando a API não responde ou retorna um resultado inválido?

Podemos tratar erros usando __try__ e __catch__. Dentro do __try__ colocamos o código que vai tentar fazer a requisição e se alguma coisa der errado o __catch__ é executado. Também é importante verificar o __resposta.ok__, porque receber uma resposta do servidor não quer dizer que a requisição deu certo. Se o __resposta.ok__ for falso podemos criar um erro antes de tentar usar os dados.

---

## Parte 2

No projeto PetSchool criamos na aula a função `carregarPets()` para buscar os pets cadastrados na API.

```javascript id="jc2e7i"
import { onMounted, ref } from 'vue';

const pets = ref([]);
const loading = ref(true);
const erro = ref('');

async function carregarPets() {

  loading.value = true;
  erro.value = '';

  try {

    // Faço a requisição para buscar os pets
    const resposta = await fetch('http://localhost:3000/pets');

    // Verifico se a resposta da API deu certo
    if (!resposta.ok) {
      throw new Error('Erro ao carregar os pets');
    }

    // Converto a resposta recebida para JSON
    pets.value = await resposta.json();

  } catch (error) {

    // erro pra imagem
    erro.value = 'Não foi possível carregar os pets.';

    console.log(error);

  } finally {

    // o carregamento fica falso se terminar de tentar carregar
    loading.value = false;
  }
}

onMounted(carregarPets);
```

Na página a gente pode usar alguns operadores do próprio vue para verificar se esta tudo certo, como no v-if e v-else ou v-else-if nesse caso (else if: )

```html id="re31y4"
<p v-if="loading">
  Carregando pets...
</p>

<p v-else-if="erro">
  {{ erro }}
</p>

<table v-else>
  <thead>
    <tr>
      <th>Nome</th>
      <th>Espécie</th>
      <th>Tutor</th>
    </tr>
  </thead>

  <tbody>
    <tr v-for="pet in pets" :key="pet.id">
      <td>{{ pet.nome }}</td>
      <td>{{ pet.especie }}</td>
      <td>{{ pet.tutorId }}</td>
    </tr>
  </tbody>
</table>
```

Primeiro o __loading__ fica como __true__, então aparece a mensagem de carregamento. Depois usamos o __fetch()__ para buscar os pets em `http://localhost:3000/pets` e o __await__ espera a API responder. Antes de usar o __.json()__ verificamos o __resposta.ok__, assim se a API retornar algum erro conseguimos tratar antes. Se estiver tudo certo os dados são colocados em __pets__, e se der algum problema o código entra no __catch__ e mostra a mensagem de erro. No final o __finally__ coloca o __loading__ como __false__, independente se a requisição deu certo ou não.

## Observação para executar o projeto

Para testar é preciso que voce deixe o projeto e a API rodando ao mesmo tempo. Em um terminal usamos _npm run dev_, que inicia o projeto e normalmente deixa ele disponível em `http://localhost:5173/`. Em outro terminal, na mesma pasta do projeto, usamos _npm run api_, que inicia o JSON Server usando o arquivo `db.json`. A API fica disponível em `http://localhost:3000/`, então os dois terminais precisam ficar rodando ao mesmo tempo.

* Link do Repo no Github se quiser dar uma olhada na aplicação: https://github.com/IgorMMichels/petHotel.git

* Costumo usar a função split do terminal da IDE para ficar em só um local facilitando para quando precisar pausar ou algo do tipo
