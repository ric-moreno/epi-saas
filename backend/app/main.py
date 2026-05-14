from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import auth, lancamentos, dashboard, estoque

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="EPI SaaS API",
    description="Sistema de Controle de Almoxarifado e EPI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,        prefix="/auth",        tags=["Autenticação"])
app.include_router(lancamentos.router, prefix="/lancamentos", tags=["Lançamentos"])
app.include_router(dashboard.router,   prefix="/dashboard",   tags=["Dashboard"])
app.include_router(estoque.router,     prefix="/estoque",     tags=["Estoque"])

@app.get("/")
def root():
    return {"status": "ok", "versao": "1.0.0"}