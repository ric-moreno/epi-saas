from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, lancamentos, items, dashboard
from app.database import Base, engine

# Cria todas as tabelas no banco (em produção use Alembic)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="EPI SaaS API",
    description="Sistema de Controle de Almoxarifado e EPI",
    version="1.0.0"
)

# Permite que o React (rodando em outra porta) acesse a API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://seudominio.com.br"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,         prefix="/auth",         tags=["Autenticação"])
app.include_router(lancamentos.router,  prefix="/lancamentos",  tags=["Lançamentos"])
app.include_router(items.router,        prefix="/items",        tags=["Itens"])
app.include_router(dashboard.router,    prefix="/dashboard",    tags=["Dashboard"])

@app.get("/")
def root():
    return {"status": "ok", "version": "1.0.0"}