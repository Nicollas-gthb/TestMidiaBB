# 📺 TestMidiaBB — Gerenciador de Mídias

> Protótipo de sistema de gerenciamento e exibição de mídias digitais desenvolvido para o **Banco do Brasil** no contexto da disciplina de **Residência Tecnológica — Porto Digital**.

---

## 📌 Sobre o Projeto

O **TestMidiaBB** é uma aplicação web fullstack que permite o gerenciamento centralizado de mídias institucionais (imagens e vídeos) exibidas em televisores distribuídos no ambiente corporativo.

Cada TV cadastrada possui uma URL dedicada (`/tv/{numero}`) que exibe em loop apenas as mídias programadas para aquele dispositivo. O operador pode apontar qualquer navegador para essa URL, pressionar `F11` e espelhar a tela em um telão real — sem necessidade de software adicional.

A aplicação conta com **análise de mídias por Inteligência Artificial**, que sugere automaticamente título, categoria, tempo de exibição e avalia a adequação do conteúdo para o ambiente bancário.

---

## 🧰 Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| Frontend | React 18 + Vite |
| Backend | FastAPI (Python) |
| Banco de Dados | PostgreSQL 15 |
| ORM / Migrations | SQLAlchemy + Alembic |
| OCR | Tesseract OCR + pytesseract |
| IA (principal) | OpenAI GPT-4o-mini |
| IA (fallback) | Google Gemini 2.5 Flash Lite |
| IA (fallback) | Anthropic Claude Haiku 4.5 |
| Proxy Reverso | Nginx |
| Containerização | Docker + Docker Compose |

---

## ✅ Pré-requisitos

Certifique-se de ter instalado na máquina **antes de qualquer coisa**:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (inclui Docker Compose) — **versão 24+**
- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/download)
- Terminal — recomendado: **Git Bash** (Windows), **Terminal** (Linux/macOS)

>⚠️ **Recomendado** instalar Python 3.13 e Node.js 20+ localmente. Para resover possíveis erros de auto-complete na IDE.

> ⚠️ **Não é necessário** PostgreSQL localmente. Tudo roda dentro dos containers Docker.


---

## 🚀 Ordem de Execução — Do Zero ao Funcional

Siga **exatamente** essa ordem para evitar erros, especialmente com o banco de dados.

### 1. Clonar o repositório

Abra o **Git Bash** ou terminal e execute:

```bash
git clone https://github.com/Nicollas-gthb/TestMidiaBB.git
cd TestMidiaBB
code .
```

---

### 2. Criar o arquivo `.env`

Na **raiz do projeto** (mesma pasta onde está o `docker-compose.yml`), crie o arquivo `.env`, e copie e cole o conteudo de `.env.example` nele.

Terminal é opcional:
```bash
# Git Bash / Linux / macOS
cp .env.example .env
```

```cmd
:: Windows CMD
copy .env.example .env
```

---

### 3. Preencher o `.env`

Abra o `.env` e preencha **todos os campos** antes de continuar.

> 🔒 Os valores das variáveis são confidenciais e devem ser obtidos com um **responsável pelo projeto**.

```env
# ─────────────────────────────────────────
# BANCO DE DADOS
# ─────────────────────────────────────────
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
DB_HOST=
DB_PORT=

# ─────────────────────────────────────────
# BACKEND / SEGURANÇA
# ─────────────────────────────────────────
SECRET_KEY=
ALGORITHM=
ACCESS_TOKEN_EXPIRE_MINUTES=

# ─────────────────────────────────────────
# INTELIGÊNCIA ARTIFICIAL
# Preencha ao menos a chave do GPT para
# habilitar a análise de mídias por IA.
# As demais são opcionais (fallback chain).
# ─────────────────────────────────────────
OPENAI_API_KEY=
GEMINI_API_KEY=
ANTHROPIC_API_KEY=
```

> 💡 A aplicação funciona sem as chaves de IA — a análise automática simplesmente ficará indisponível. Para o fallback chain funcionar completamente, preencha o máximo que estiver ativo.

---
## 🖥️ Ambiente de Desenvolvimento Local (Recomendado)

> Esta seção é **opcional** e não é necessária para rodar a aplicação — ela roda inteiramente via Docker.
> O objetivo aqui é configurar o ambiente local para que o **VS Code** reconheça os pacotes e ofereça **autocomplete, intellisense e sem erros de import** no editor.

---

### 🐍 Backend — Criar o `.venv` e instalar o `requirements.txt`

Execute no **Git Bash ou terminal**, dentro da pasta `backend/`:

```bash
# 1. Entrar na pasta do backend
cd backend

# 2. Criar o ambiente virtual
python -m venv .venv

# 3. Ativar o ambiente virtual
# Git Bash / Linux / macOS:
source .venv/Scripts/activate

# Windows CMD:
.venv\Scripts\activate.bat

# 4. Instalar as dependências
pip install -r requirements.txt

# 5. Voltar para a raiz do projeto ao terminar
cd ..
```

> 💡 Após ativar o `.venv`, o VS Code pode pedir para selecionar o interpretador Python — escolha o que aponta para `.venv/Scripts/python.exe` (Windows) ou `.venv/bin/python` (Linux/macOS).

> ⚠️ Para **desativar** o (.venv) na linha do terminal, basta escrever e rodar `deactivate`
---

### ⚛️ Frontend — Instalar dependências com `npm install`

Execute no **Git Bash ou terminal**, dentro da pasta `frontend/`:

```bash
# 1. Entrar na pasta do frontend
cd frontend

# 2. Instalar as dependências do Node
npm install

# 3. Voltar para a raiz do projeto ao terminar
cd ..
```

> 💡 Isso cria a pasta `node_modules/` localmente, permitindo que o VS Code resolva os imports do React e ofereça autocomplete. Essa pasta já está no `.gitignore` e não é enviada ao repositório.

---

> ⚠️ Lembre-se: mesmo com o ambiente local configurado, a aplicação deve ser executada via `docker compose up`. O `.venv` e o `node_modules` locais servem **apenas para o editor**.
---

### 4. Subir os containers

Com o `.env` preenchido, ainda na **raiz do projeto**, execute:

```bash
docker compose up --build
```

> Esse comando irá:
> 1. Construir as imagens do backend e frontend
> 2. Subir o PostgreSQL e aguardar ele estar saudável
> 3. Rodar as migrations do Alembic automaticamente (`alembic upgrade head`)
> 4. Iniciar o FastAPI, o React e o Nginx

Na primeira execução, o processo pode levar alguns minutos. Nas próximas, use:

```bash
docker compose up
```

---

### 5. Acessar a aplicação

| Serviço | URL |
|---|---|
| Aplicação (frontend) | http://localhost |
| API (backend) | http://localhost/api |
| Visualização de TV | http://localhost/tv/{numero} |

---

## 🗄️ Banco de Dados — Comandos Importantes

Todos os comandos abaixo devem ser executados no **Git Bash ou terminal**, a partir da **raiz do projeto**, com os containers rodando.

### Rodar migrations manualmente

```bash
docker compose exec fastapi alembic upgrade head
```

### Criar uma nova migration após alterar models

```bash
docker compose exec fastapi alembic revision --autogenerate -m "descricao da alteracao"
```

### Acessar o banco de dados diretamente

```bash
docker compose exec db psql -U <POSTGRES_USER> -d <POSTGRES_DB>
```

> Substitua `<POSTGRES_USER>` e `<POSTGRES_DB>` pelos valores definidos no seu `.env`.

### Popular o banco com dados iniciais (seed)

```bash
docker compose exec fastapi python app/seed.py
```

---

## 🐳 Comandos Docker Úteis

Todos executados na **raiz do projeto** via **Git Bash ou terminal**:

```bash
# Subir os containers em background (sem travar o terminal)
docker compose up -d

# Subir e reconstruir as imagens (use após alterar Dockerfile ou requirements)
docker compose up --build

# Parar os containers sem apagar dados
docker compose down

# Parar e apagar volumes (CUIDADO: apaga o banco de dados)
docker compose down -v

# Ver logs em tempo real de todos os containers
docker compose logs -f

# Ver logs apenas do backend
docker compose logs -f fastapi

# Ver logs apenas do frontend
docker compose logs -f react

# Listar containers em execução
docker compose ps

# Reiniciar apenas um serviço sem derrubar os outros
docker compose restart fastapi
```

---

## 🤖 Integração com Inteligência Artificial

A aplicação possui um endpoint de análise de mídias (`POST /api/midias/analyze`) que utiliza um **fallback chain** de provedores de IA:

```
GPT-4o-mini  →  Gemini 2.5 Flash Lite  →  Claude Haiku 4.5
    ↓ falha           ↓ falha                  ↓ falha
                                         Fallback local (OCR)
```

O sistema tenta os provedores na ordem acima. Se um falhar (cota esgotada, chave inválida, instabilidade), automaticamente tenta o próximo — sem interromper a operação.

Para cada mídia analisada, a IA retorna:

| Campo | Descrição |
|---|---|
| `titulo` | Título sugerido para a mídia |
| `categoria` | `marketing`, `informativo`, `institucional` ou `alerta` |
| `tempo_exibicao` | Tempo sugerido em segundos baseado na densidade de texto |
| `descricao` | Descrição breve do conteúdo |
| `conteudo_seguro` | `true` ou `false` |
| `alerta` | Justificativa caso o conteúdo seja inadequado |
| `provedor` | Qual provedor de IA respondeu |

> ⚠️ **Atualmente apenas o GPT-4o-mini está com integração validada.** Gemini e Claude estão implementados no fallback chain mas ainda em fase de testes.

---

## 📁 Estrutura do Projeto

```
TestMidiaBB/
├── backend/
│   ├── app/
│   │   ├── core/          # Configurações, banco, segurança
│   │   ├── models/        # Models SQLAlchemy
│   │   ├── routes/        # Endpoints FastAPI
│   │   ├── schemas/       # Schemas Pydantic
│   │   ├── services/      # OCR, IA (GPT, Gemini, Claude), roteador
│   │   ├── main.py
│   │   └── seed.py
│   ├── migrations/
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   └── Dockerfile
├── nginx/
│   └── nginx.conf
├── .env.example
├── .gitignore
└── docker-compose.yml
```

---

## Git e boas práticas

### O que não sobe para o repositório

O `.gitignore` já está configurado para ignorar:

```
.env              # credenciais e segredos
.venv/            # ambiente virtual Python local
node_modules/     # dependências do Node
__pycache__/      # cache do Python
dist/             # build de produção
*.log             # arquivos de log
```

### Fluxo recomendado

```bash
# Criar branch para nova feature
git checkout -b feature/nome-da-feature

# Commitar alterações
git add .
git commit -m "feat: descrição clara do que foi feito"

# Subir para o repositório
git push origin feature/nome-da-feature
```

### Padrão de commits sugerido

| Prefixo | Uso |
|---|---|
| `feat:` | Nova funcionalidade |
| `fix:` | Correção de bug |
| `refactor:` | Refatoração sem mudança de comportamento |
| `docs:` | Alterações na documentação |
| `chore:` | Configurações, dependências |

---

## ⚠️ Observações Importantes

- **Nunca suba o `.env` para o repositório.** Ele já está no `.gitignore`, mas fique atento.
- **Sempre preencha o `.env` antes** de rodar `docker compose up`, caso contrário o banco não inicializa corretamente e o backend não conecta.
- Em caso de erro de conexão com o banco na primeira execução, rode `docker compose down` e `docker compose up` novamente — pode ser que o backend tenha tentado conectar antes do PostgreSQL estar pronto.
- Para **Windows**, use sempre o **Git Bash** para os comandos `docker compose exec`. O CMD pode apresentar problemas com alguns caracteres.

---

## 👥 Projeto Acadêmico

Desenvolvido como protótipo na disciplina de **Residência Tecnológica** em parceria com o **Porto Digital** e o **Banco do Brasil**.