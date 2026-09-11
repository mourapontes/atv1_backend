# DevShowcase API

Backend da plataforma **DevShowcase**.

> **Etapa 1 do projeto prático:** modelagem de domínio, persistência relacional e endpoints básicos.

## Contexto acadêmico

| Item | Detalhe |
|---|---|
| Instituição | Universidade Aberta do Brasil (UAB) / UESPI |
| Curso | Tecnologia em Sistemas para Internet |
| Disciplina | Backend |
| Atividade | Modelagem de domínio, persistência e endpoints básicos |
| Prazo | 05/09/2026 às 18h00 até 25/09/2026 às 23h59 |

**Objetivo da atividade:** nesta primeira etapa do projeto prático, dar início ao desenvolvimento do backend da plataforma DevShowcase API, implementando a fundação arquitetural da aplicação com suporte a persistência de dados relacional.

**Requisitos técnicos entregues:**
1. Projeto Node.js/Express estruturado, com repositório git público e `.gitignore` adequado.
2. Modelagem das entidades `Profile`, `Project`, `Technology` e `Feedback`, com os relacionamentos `Profile 1:N Project`, `Project N:N Technology` e `Project 1:N Feedback`.
3. Repositórios de persistência e DTOs de entrada (com validação de campos obrigatórios e URLs) e de saída.
4. Endpoints REST implementados e testados: `POST/GET /api/profiles`, `POST/GET /api/technologies` e `POST/GET /api/projects`.

## Sumário

- [Contexto acadêmico](#contexto-acadêmico)
- [Stack tecnológica](#stack-tecnológica)
- [Modelagem de domínio](#modelagem-de-domínio)
- [Arquitetura do projeto](#arquitetura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Como rodar localmente](#como-rodar-localmente)
- [Roteiro de apresentação (demo ao vivo)](#roteiro-de-apresentação-demo-ao-vivo)
- [Endpoints da API](#endpoints-da-api)
- [Testando localmente pelo navegador](#testando-localmente-pelo-navegador)
- [Testes automatizados](#testes-automatizados)
- [Solução de problemas](#solução-de-problemas)
- [Próximas etapas](#próximas-etapas)

## Stack tecnológica

| Camada          | Tecnologia                                    |
|-----------------|------------------------------------------------|
| Runtime         | Node.js (≥ 18)                                 |
| Framework HTTP  | Express                                        |
| ORM             | Sequelize — PostgreSQL                        |
| Banco de dados  | PostgreSQL (via `pg`/`pg-hstore`)              |
| Containers      | Docker + Docker Compose                        |
| Validação       | Joi (DTOs de entrada)                          |
| Testes          | Jest + Supertest                               |

## Modelagem de domínio

4 entidades e 3 relacionamentos, conforme exigido na especificação:

```mermaid
erDiagram
    PROFILE ||--o{ PROJECT : "1:N"
    PROJECT ||--o{ FEEDBACK : "1:N"
    PROJECT }o--o{ TECHNOLOGY : "N:N"

    PROFILE {
        int id PK
        string name
        string email
        text bio
        string avatarUrl
    }
    PROJECT {
        int id PK
        string title
        text description
        string repositoryUrl
        int profileId FK
    }
    TECHNOLOGY {
        int id PK
        string name
    }
    FEEDBACK {
        int id PK
        text comment
        int rating
        int projectId FK
    }
```

- **Profile 1:N Project** — um perfil possui vários projetos.
- **Project N:N Technology** — um projeto usa várias tecnologias, e uma tecnologia aparece em vários projetos (tabela de junção `project_technologies`).
- **Project 1:N Feedback** — um projeto recebe vários feedbacks.

## Arquitetura do projeto

Fluxo de uma requisição, camada por camada:

```mermaid
flowchart LR
    A[Rota] --> B[Middleware de validação<br/>Joi / DTO de entrada]
    B --> C[Controller]
    C --> D[Repository]
    D --> E[Model Sequelize]
    E --> F[(Banco de dados)]
    C --> G[DTO de saída]
    G --> H[Resposta JSON]
```

```
src/
  config/database.js   # Configuração do Sequelize (PostgreSQL)
  models/               # Entidades e associações (Profile, Project, Technology, Feedback)
  dtos/                 # Schemas de validação (entrada) e formatação (saída)
  repositories/         # Camada de acesso a dados (queries Sequelize)
  controllers/          # Lógica de cada endpoint
  routes/                # Definição das rotas REST
  middlewares/           # Validação de entrada e tratamento de erros
  app.js                 # Configuração do Express
  server.js              # Ponto de entrada: conecta ao banco e sobe o servidor
scripts/
  demo.js                # Script de demonstração ao vivo (chama todos os endpoints)
  init-multiple-databases.sh  # Cria os bancos dev/test no container do PostgreSQL
public/
  cadastro-usuario.html  # Formulário HTML para cadastro de perfil (POST /api/profiles) via navegador
tests/
  *.test.js              # Testes de integração (Jest + Supertest)
Dockerfile               # Imagem da API (Node 20)
docker-compose.yml        # Sobe API + PostgreSQL localmente
```

## Pré-requisitos

- Node.js ≥ 18 instalado (`node --version`) — necessário apenas para rodar sem Docker.
- Uma instância PostgreSQL acessível (local ou remota) e sua connection string — ou Docker + Docker Compose para subir tudo localmente.

## Como rodar localmente

### Opção A — Docker Compose (recomendado)

Sobe a API e o PostgreSQL juntos, sem precisar instalar Node ou Postgres na máquina:

```bash
git clone <url-do-seu-repositorio>
cd devshowcase-api
cp .env.example .env
docker compose up --build
```

A API fica disponível em `http://localhost:3555` e o PostgreSQL em `localhost:5432` (usuário/senha `postgres`, bancos `devshowcase` e `devshowcase_test`). Para rodar em segundo plano, use `docker compose up --build -d`; para parar, `docker compose down` (adicione `-v` para apagar também o volume de dados).

> Não rode a imagem isoladamente com `docker run` — o `DATABASE_URL` e as demais variáveis só são injetadas pelo serviço `api` do `docker-compose.yml`. Use sempre `docker compose up`.

### Opção B — Node.js local

```bash
git clone <url-do-seu-repositorio>
cd devshowcase-api
npm install
cp .env.example .env
# edite o .env e defina DATABASE_URL com a connection string do seu PostgreSQL
npm run dev   # ou: npm start
```

Ao subir, o console deve mostrar:

```
Conexão com o banco de dados estabelecida com sucesso.
Modelos sincronizados com o banco de dados.
DevShowcase API rodando em http://localhost:3555
```

O banco PostgreSQL precisa existir previamente (ex.: `createdb devshowcase`, ou automaticamente via `docker compose up`); os models são sincronizados automaticamente via `sequelize.sync()` na inicialização. Defina `DATABASE_URL` no `.env` apontando para essa instância.

## Roteiro de apresentação (demo ao vivo)

Roteiro para gravar o vídeo de apresentação (5 a 8 minutos), demonstrando os **6 endpoints exigidos** com a requisição sendo executada e a resposta da API aparecendo no console — **sem Postman**, usando apenas `curl` no terminal (compartilhando a tela inteira).

Use **dois terminais**:

**Terminal 1 — sobe o servidor e deixe rodando:**
```bash
npm run dev
```

**Terminal 2 — executa cada requisição na ordem abaixo, mostrando o comando e a resposta:**

**1. `POST /api/profiles`** — cadastro de perfil com validações
```bash
curl -X POST http://localhost:3555/api/profiles \
  -H "Content-Type: application/json" \
  -d '{"name":"Ana Souza","email":"ana@example.com","bio":"Dev backend"}'
```

**2. `GET /api/profiles/:id`** — busca o perfil criado (use o `id` retornado no passo 1)
```bash
curl http://localhost:3555/api/profiles/1
```

**3. `POST /api/technologies`** — cadastro de tecnologia com validações
```bash
curl -X POST http://localhost:3555/api/technologies \
  -H "Content-Type: application/json" -d '{"name":"Node.js"}'
```

**4. `GET /api/technologies`** — listagem de todas as tecnologias
```bash
curl http://localhost:3555/api/technologies
```

**5. `POST /api/projects`** — cadastro de projeto com validações (vinculando o `profileId` e o `technologyIds` criados acima)
```bash
curl -X POST http://localhost:3555/api/projects \
  -H "Content-Type: application/json" \
  -d '{"title":"DevShowcase API","repositoryUrl":"https://github.com/ana/devshowcase","profileId":1,"technologyIds":[1]}'
```

**6. `GET /api/projects`** — listagem de projetos
```bash
curl http://localhost:3555/api/projects
```

**Extra opcional (mostra a validação dos DTOs):** repita o passo 1 sem o campo `name`, ou o passo 5 com `title` vazio, para exibir a resposta `400` com as mensagens de erro.

> Alternativa automatizada: `npm run demo` (script [`scripts/demo.js`](scripts/demo.js)) executa essa mesma sequência sozinho, imprimindo cada requisição e resposta no console — útil para conferir o roteiro antes de gravar, mas para o vídeo em si prefira rodar os `curl` acima manualmente, pausando em cada resposta.

Se o servidor não estiver rodando, tanto o `curl` (connection refused) quanto o `npm run demo` avisam que a API precisa estar de pé (`npm run dev`) antes de qualquer requisição.

## Endpoints da API

| Método | Rota                     | Descrição                              |
|--------|--------------------------|------------------------------------------|
| POST   | `/api/profiles`          | Cadastra um perfil de desenvolvedor       |
| GET    | `/api/profiles/:id`      | Busca um perfil por id                    |
| POST   | `/api/technologies`      | Cadastra uma tecnologia                   |
| GET    | `/api/technologies`      | Lista todas as tecnologias                |
| POST   | `/api/projects`          | Cadastra um projeto                       |
| GET    | `/api/projects`          | Lista projetos (`?profileId=` opcional)   |

### Profiles

**POST /api/profiles**
```json
{
  "name": "Ana Souza",
  "email": "ana@example.com",
  "bio": "Dev backend apaixonada por APIs",
  "avatarUrl": "https://example.com/ana.png"
}
```
Validações: `name` obrigatório e não vazio · `email` obrigatório, formato válido e único · `avatarUrl` opcional, deve ser URL válida.

**GET /api/profiles/:id** — retorna o perfil com a lista de projetos vinculados (404 se não existir).

### Technologies

**POST /api/technologies**
```json
{ "name": "Node.js" }
```
Validações: `name` obrigatório, não vazio e único (409 se duplicado).

**GET /api/technologies** — lista todas as tecnologias, ordenadas por nome.

### Projects

**POST /api/projects**
```json
{
  "title": "DevShowcase API",
  "description": "Backend do projeto",
  "repositoryUrl": "https://github.com/ana/devshowcase",
  "profileId": 1,
  "technologyIds": [1, 2]
}
```
Validações: `title` obrigatório e não vazio · `repositoryUrl` obrigatória e deve ser URL válida · `profileId` obrigatório e deve referenciar um Profile existente · `technologyIds` opcional, deve referenciar Technologies existentes.

**GET /api/projects** — lista todos os projetos, aceita `?profileId=` para filtrar por perfil.

### Testando manualmente com `curl`

```bash
# Criar perfil
curl -X POST http://localhost:3555/api/profiles \
  -H "Content-Type: application/json" \
  -d '{"name":"Ana Souza","email":"ana@example.com"}'

# Buscar perfil
curl http://localhost:3555/api/profiles/1

# Criar tecnologia
curl -X POST http://localhost:3555/api/technologies \
  -H "Content-Type: application/json" -d '{"name":"Node.js"}'

# Listar tecnologias
curl http://localhost:3555/api/technologies

# Criar projeto
curl -X POST http://localhost:3555/api/projects \
  -H "Content-Type: application/json" \
  -d '{"title":"DevShowcase API","repositoryUrl":"https://github.com/ana/devshowcase","profileId":1,"technologyIds":[1]}'

# Listar projetos
curl http://localhost:3555/api/projects
```

## Testando localmente pelo navegador

Com o servidor rodando (`npm run dev` ou `docker compose up`), a barra de endereço do navegador já faz requisições `GET` diretamente, sem precisar de `curl` ou Postman.

Para cadastrar um perfil sem usar `curl`/DevTools, abra o formulário [`public/cadastro-usuario.html`](public/cadastro-usuario.html) diretamente no navegador, ou, com a API rodando, acesse [http://localhost:3555/public/cadastro-usuario.html](http://localhost:3555/public/cadastro-usuario.html) — ele envia um `POST /api/profiles` para a API (por padrão em `http://localhost:3555`, editável no próprio formulário).

Clique nos links abaixo (com a API de pé em `localhost:3555`):

- [http://localhost:3555/public/cadastro-usuario.html](http://localhost:3555/public/cadastro-usuario.html)
- [http://localhost:3555/api/profiles/1](http://localhost:3555/api/profiles/1)
- [http://localhost:3555/api/technologies](http://localhost:3555/api/technologies)
- [http://localhost:3555/api/projects](http://localhost:3555/api/projects)

> Esses links só funcionam com a API rodando na sua máquina; o Markdown do GitHub não resolve `localhost`, então abra-os a partir do seu editor/navegador local.

Para testar os endpoints `POST` pelo navegador, abra o **DevTools (F12) → Console** (em qualquer aba, inclusive em branco) e rode `fetch`:

```js
fetch('http://localhost:3555/api/technologies', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Node.js' }),
}).then((r) => r.json()).then(console.log);
```

## Testes automatizados

Testes de integração (Jest + Supertest) cobrem os 6 endpoints exigidos, incluindo casos de sucesso, validação e erro (404/409) — 18 testes ao todo, em 3 suítes (`profile`, `technology`, `project`).

Os testes rodam contra um banco PostgreSQL isolado (`devshowcase_test`, criado automaticamente pelo `docker-compose.yml`), não contra o banco de desenvolvimento. Suba o Postgres antes de testar:

```bash
docker compose up -d postgres   # garante o Postgres (e o banco devshowcase_test) disponível em localhost:5432
npm test
```

Por padrão os testes usam `postgres://postgres:postgres@localhost:5432/devshowcase_test`; defina `TEST_DATABASE_URL` no ambiente para apontar para outro banco.

## Solução de problemas

| Sintoma | Causa provável | Solução |
|---|---|---|
| `DATABASE_URL não definida` ao subir a API | `.env` ausente ou variável não configurada | `cp .env.example .env` e defina `DATABASE_URL` (ou use `docker compose up`, que já injeta a variável) |
| Erro ao rodar a imagem com `docker run` direto | Variáveis de ambiente do serviço `api` só existem via Compose | Use `docker compose up --build` em vez de `docker run` na imagem isolada |
| `GET /api/technologies` ou `/api/projects` retornam `[]` | Banco recém-criado, sem registros | Normal em um banco novo; cadastre dados via `POST` ou rode `npm run demo` |
| Testes falham por timeout/conexão recusada | PostgreSQL de teste não está rodando | `docker compose up -d postgres` antes de `npm test` |
| Porta `3555` já em uso | Outro processo/serviço ocupando a porta | Altere `PORT` no `.env` (e em `docker-compose.yml`, se necessário) |

## Próximas etapas

- Endpoint de `Feedback` (`Project 1:N Feedback`), ainda modelado mas sem rotas/controller dedicados.
- Paginação e filtros adicionais em `GET /api/projects` e `GET /api/technologies`.
- Autenticação/autorização para os endpoints de escrita.
- Deploy da imagem Docker em um ambiente gerenciado (ex.: Render, Railway, AKS).

