# 🦺 EPI SaaS — Sistema de Controle de Almoxarifado e EPI

Sistema web para controle de Equipamentos de Proteção Individual (EPI) e almoxarifado, desenvolvido com FastAPI e React.

---

## 🚀 Tecnologias

### Backend
- **Python 3.12** + **FastAPI** — API REST
- **SQLAlchemy** — ORM (mapeamento banco↔código)
- **Alembic** — Migrations do banco de dados
- **PostgreSQL** — Banco de dados
- **JWT** — Autenticação por token
- **Passlib + Bcrypt** — Criptografia de senhas

### Frontend
- **React 18** + **Vite** — Interface web
- **Tailwind CSS** — Estilização
- **TanStack Query** — Cache e sincronização de dados
- **React Router** — Navegação entre páginas
- **Axios** — Requisições HTTP
- **Recharts** — Gráficos
- **Lucide React** — Ícones

### Infraestrutura
- **Railway** — Hospedagem do backend
- **Vercel** — Hospedagem do frontend

---

## 📋 Funcionalidades

- ✅ Autenticação com JWT (login, logout, perfis)
- ✅ Lançamentos de Entrada e Saída de EPI
- ✅ Controle de CA, Nº de Série e Vencimento
- ✅ Cálculo automático de saldo por item
- ✅ Dashboard com indicadores e alertas
- ✅ Estoque com totalizadores por item
- ✅ Filtros e paginação nas listagens
- ✅ Perfis de acesso (admin, operador, consulta)

---

## 🏗️ Estrutura do Projeto

```
epi-saas/
├── backend/                  # API FastAPI (Python)
│   ├── app/
│   │   ├── main.py           # Ponto de entrada
│   │   ├── config.py         # Configurações
│   │   ├── database.py       # Conexão com banco
│   │   ├── models/           # Tabelas do banco
│   │   │   ├── lancamento.py
│   │   │   └── usuario.py
│   │   ├── routers/          # Endpoints da API
│   │   │   ├── auth.py
│   │   │   ├── lancamentos.py
│   │   │   ├── dashboard.py
│   │   │   └── estoque.py
│   │   └── services/         # Regras de negócio
│   │       └── estoque.py
│   ├── alembic/              # Migrations
│   ├── requirements.txt
│   ├── Procfile
│   └── .env                  
│
└── frontend/                 # Interface React
    ├── src/
    │   ├── api/              # Chamadas à API
    │   ├── components/       # Componentes reutilizáveis
    │   ├── pages/            # Telas do sistema
    │   └── utils/            # Utilitários
    ├── vercel.json
    └── .env.production       
```

---

## ⚙️ Instalação Local

### Pré-requisitos
- Python 3.12+
- Node.js 20+
- PostgreSQL 16+ (ou conta no Supabase)

### Backend

```bash
cd backend

# Criar ambiente virtual
python -m venv venv

# Ativar (Windows)
venv\Scripts\activate

# Instalar dependências
pip install -r requirements.txt

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais

# Criar tabelas no banco
alembic upgrade head

# Iniciar servidor
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Edite com a URL do backend

# Iniciar servidor de desenvolvimento
npm run dev
```

---

## 🔐 Variáveis de Ambiente

### Backend — `.env`

```env
DATABASE_URL=postgresql://usuario:senha@host:5432/epi_saas
SECRET_KEY=chave-secreta-longa-e-aleatoria
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=480
ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend — `.env.local`

```env
VITE_API_URL=http://localhost:8000
```


---

## 🌐 Deploy

### Backend — Railway
1. Conecte o repositório no [Railway](https://railway.app)
2. Configure Root Directory: `backend`
3. Adicione as variáveis de ambiente
4. O deploy é automático a cada `git push`

### Frontend — Vercel
1. Conecte o repositório no [Vercel](https://vercel.com)
2. Configure Root Directory: `frontend`
3. Adicione `VITE_API_URL` nas variáveis de ambiente
4. O deploy é automático a cada `git push`

---

## 📡 Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/auth/login` | Autenticar usuário |
| POST | `/auth/criar-usuario` | Criar novo usuário |
| GET | `/lancamentos/` | Listar lançamentos |
| POST | `/lancamentos/` | Criar lançamento |
| PUT | `/lancamentos/{id}` | Editar lançamento |
| DELETE | `/lancamentos/{id}` | Excluir lançamento |
| GET | `/estoque/` | Saldo por item |
| GET | `/dashboard/resumo` | Indicadores gerais |
| GET | `/dashboard/vencimentos` | Itens a vencer |

Documentação completa disponível em `/docs` após iniciar o servidor.

---

## 🔄 Fluxo de Desenvolvimento

```bash
# 1. Fazer mudanças no código

# 2. Testar localmente

# 3. Commitar e publicar
git add .
git commit -m "feat: descrição da mudança"
git push

# Railway e Vercel fazem deploy automaticamente
```

### Convenção de commits

```
feat:     nova funcionalidade
fix:      correção de bug
docs:     documentação
refactor: refatoração sem mudança de comportamento
style:    formatação, sem mudança de lógica
```

---

## 📄 Licença
Desenvolvido por: Pedro Ricardo Moreno  
https://www.linkedin.com/in/pedroricardomoreno/
