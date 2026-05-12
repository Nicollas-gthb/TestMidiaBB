# TestMidiaBB 📺

Sistema de gerenciamento de mídias para telões corporativos. Desenvolvido como proposta de solução para o desafio de Residência do Porto Digital.

> Em ambientes com múltiplos telões — cada um controlado por um PC — o sistema permite definir e gerenciar a playlist de mídias de cada TV de forma centralizada, através de uma interface web.

---

## Sumário

- [Stack](#stack)
- [Arquitetura](#arquitetura)
- [Pré-requisitos](#pré-requisitos)
- [Configuração do ambiente](#configuração-do-ambiente)
- [Rodando o projeto](#rodando-o-projeto)
- [Comandos úteis](#comandos-úteis)
- [Primeiro acesso](#primeiro-acesso)
- [Rotas da aplicação](#rotas-da-aplicação)
- [Rotas da API](#rotas-da-api)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Git e boas práticas](#git-e-boas-práticas)

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 18 + Vite |
| Backend | FastAPI + SQLAlchemy + Alembic |
| Banco de dados | PostgreSQL 15 |
| Servidor web | Nginx Alpine |
| Infraestrutura | Docker + Docker Compose |

---

## Arquitetura

```
Browser → Nginx (:80) → /api/*     → FastAPI (:8000)
                      → /midias/*  → FastAPI (arquivos estáticos)
                      → /docs      → FastAPI (Swagger)
                      → /*         → React + Vite (:5173)
```

O Nginx atua como ponto de entrada único da aplicação. Todas as requisições passam por ele, que as roteia internamente para o serviço correto. Isso elimina problemas de CORS e impede que os serviços internos fiquem expostos diretamente.

---

## Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e em execução
- [Git](https://git-scm.com/)
- [Python 3.12+](https://www.python.org/) — apenas para o ambiente local do VSCode (IntelliSense)
- [Node.js 20+](https://nodejs.org/) — apenas se precisar instalar dependências fora do container

---

## Configuração do ambiente

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/TestMidiaBB.git
cd TestMidiaBB
```

### 2. Crie o arquivo `.env`

Copie o conteúdo do arquivo de exemplo `.env.example` e preencha as variáveis:


> ⚠️ Os valores das variáveis de ambiente são secretos, contate um responsável do projeto para receber essas variáveis.

Edite o `.env` com os valores corretos:

```env
POSTGRES_USER=user
POSTGRES_PASSWORD=pass
POSTGRES_DB=nomedobanco
DB_HOST=host
DB_PORT=porta

DATABASE_URL=url

SECRET_KEY=sua_chave_secreta_aqui
ALGORITHM=algoritimo
```

> ⚠️ O `DB_HOST` deve ser `db` — nome do serviço no Docker Compose. Não use `localhost`.

### 3. Configure o ambiente Python local (para o VSCode)

Esse passo é necessário apenas para o VSCode reconhecer os pacotes e não exibir erros visuais. Não interfere no Docker.

**Windows:**
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

**Linux/Mac:**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cd ..
```

Ao finalizar desative o `(.venv)` digitando no terminal:

```bash
deactivate
```

Caso o `(.venv)` ative sozinho em outro momento desnecessário, é só desativar

---


## Rodando o projeto

### Primeira execução

```bash
docker compose up --build
```

O `--build` garante que as imagens sejam construídas do zero. Na primeira execução o Docker irá:

1. Baixar as imagens base (`python`, `node`, `postgres`, `nginx`)
2. Instalar dependências do backend (`requirements.txt`)
3. Instalar dependências do frontend (`npm install`)
4. Subir o banco de dados e aguardar o healthcheck
5. Rodar as migrations do Alembic automaticamente
6. Popular o banco com o seed inicial (TVs e usuário admin)
7. Iniciar o Nginx, FastAPI e React

Quando o log exibir:
```
fastapi-1  | Application startup complete.
react-1    | VITE ready in Xms
```

Acesse **http://localhost** no navegador.

### Execuções seguintes

Para ativar o projeto no navegador

```bash
docker compose up
```

Para desativar o projeto no navegador, sem excluir no docker desktop

```bash
docker compose stop
```

### Parar os containers

```bash
docker compose down
```

Depois de usar esse, para construir os containers novamente, vai precisar do

 `docker compose up --build`

---

## Comandos úteis

### Migrations (Alembic)

Alembic é uma ferramenta python, para controle de versão do banco de dados

Sempre rodar dentro do container do backend:

```bash
# Gerar nova migration após alterar um model
docker compose exec fastapi alembic revision --autogenerate -m "descricao da alteracao"

# Aplicar migrations pendentes
docker compose exec fastapi alembic upgrade head

# Reverter última migration
docker compose exec fastapi alembic downgrade -1
```

### Instalar dependências

**Backend** — adicionar ao `requirements.txt` e rebuildar:
```bash
# Adiciona no requirements.txt, depois:
docker compose up --build fastapi
```

**Frontend** — instalar dentro do container:
```bash
docker compose exec react npm install nome-do-pacote
```

> ⚠️ No frontend, sempre instale dentro do container. Instalar localmente não reflete no ambiente Docker.

### Acessar o banco de dados

```bash
docker compose exec db psql -U user -d appdb
```

Comandos úteis dentro do psql:
```sql
\dt          -- lista tabelas
\q           -- sai do psql
SELECT * FROM tvs;
SELECT id, nome, email, perfil FROM usuarios;
```

### Ver logs

```bash
# Todos os serviços
docker compose logs -f

# Serviço específico
docker compose logs -f fastapi
docker compose logs -f react
docker compose logs -f nginx
```

### Entrar dentro de um container

```bash
docker compose exec fastapi bash
docker compose exec react sh
```

---

## Primeiro acesso

O seed popula automaticamente o banco com os dados iniciais:

**TVs pré-cadastradas:**

| Número | Nome |
|---|---|
| 1 | tvRec |
| 2 | tvRef |
| 3 | tvHall |

**Usuário administrador:**

| Campo | Valor |
|---|---|
| Email | admin@email.com |
| Senha | adminsenha |
| Perfil | admin |

> O seed verifica se já existem dados antes de inserir — rodar o projeto múltiplas vezes não duplica os registros.

---

## Rotas da aplicação

| Rota | Descrição |
|---|---|
| `/home` | Página inicial |
| `/midia` | Gerenciamento de mídias |
| `/tv` | Gerenciamento de TVs |
| `/tv/{numero}` | Exibição da playlist da TV em tela cheia |

### Documentação da API (Swagger)

Disponível em **http://localhost/docs**

---

## Rotas da API

### Auth
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/auth/login` | Autenticação, retorna JWT |
| POST | `/api/auth/login/swagger` | Login via Swagger UI |

### TVs
| Método | Rota | Descrição | Perfil |
|---|---|---|---|
| GET | `/api/tv/` | Lista TVs ativas | Autenticado |
| POST | `/api/tv/` | Cadastra nova TV | Admin |
| DELETE | `/api/tv/{id}` | Desativa TV (soft delete) | Admin |

### Mídias
| Método | Rota | Descrição | Perfil |
|---|---|---|---|
| GET | `/api/midias/` | Lista mídias ativas | Autenticado |
| POST | `/api/midias/upload` | Upload e vincula às TVs | Autenticado |
| DELETE | `/api/midias/{id}` | Desativa mídia (soft delete) | Autenticado |

### Playlist
| Método | Rota | Descrição | Perfil |
|---|---|---|---|
| GET | `/api/tv/{numero}/playlist` | Retorna playlist ativa da TV | Público |

---

## Estrutura de pastas

```
TestMidiaBB/
├── docker-compose.yml
├── .env                    # Não sobe para o git
├── .env.example            # Modelo das variáveis de ambiente
├── .gitignore
├── nginx/
│   └── nginx.conf
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── alembic.ini
│   ├── migrations/
│   │   ├── env.py
│   │   └── versions/
│   └── app/
│       ├── main.py
│       ├── seed.py
│       ├── core/
│       │   ├── config.py
│       │   ├── database.py
│       │   └── security.py
│       ├── models/
│       │   ├── __init__.py
│       │   ├── usuario.py
│       │   ├── tv.py
│       │   ├── midia.py
│       │   └── playlist_item.py
│       ├── schemas/
│       │   ├── auth.py
│       │   ├── tv.py
│       │   ├── midia.py
│       │   ├── playlist_item.py
│       │   └── usuario.py
│       └── routers/
│           ├── auth.py
│           ├── tvs.py
│           ├── midias.py
│           └── playlist.py
└── frontend/
    ├── Dockerfile
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api/
        │   └── axios.js
        ├── contexts/
        │   ├── AuthContext.jsx
        │   └── ThemeContext.jsx
        ├── routes/
        │   └── AppRoutes.jsx
        ├── pages/
        │   ├── home/
        │   ├── midias/
        │   └── tvs/
        └── components/
            ├── midia/
            └── shared/
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

## Observações importantes

**Validade de mídias:** Mídias com data de validade expirada são automaticamente excluídas da playlist na próxima consulta — sem necessidade de ação manual.

**Apresentações em PowerPoint:** O sistema suporta imagens (`jpeg`, `png`) e vídeos (`mp4`). Para exibir apresentações, converta para um desses formatos antes do upload.

**Atualização da playlist:** Ao acessar `/tv/{numero}`, a playlist é carregada no início e recarregada automaticamente a cada volta do loop. Mídias adicionadas ou removidas entram em vigor na próxima volta.

**Limite de upload:** O Nginx está configurado para aceitar arquivos de até `100MB`. Para vídeos maiores, ajuste o `client_max_body_size` no `nginx.conf`.
