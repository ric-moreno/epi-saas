from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
from app.database import get_db
from app.models.usuario import Usuario
from app.config import settings

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verificar_senha(senha_digitada, senha_hash):
    return pwd_context.verify(senha_digitada, senha_hash)

def gerar_token(dados: dict):
    expiracao = datetime.utcnow() + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    dados.update({"exp": expiracao})
    return jwt.encode(dados, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


@router.post("/login")
def login(dados: dict, db: Session = Depends(get_db)):
    email = dados.get("email", "")
    senha = dados.get("senha", "")

    usuario = db.query(Usuario).filter(Usuario.email == email).first()

    if not usuario or not verificar_senha(senha, usuario.senha_hash):
        raise HTTPException(status_code=401, detail="Email ou senha incorretos")

    if not usuario.ativo:
        raise HTTPException(status_code=403, detail="Usuário inativo")

    token = gerar_token({"sub": str(usuario.id), "email": usuario.email})

    return {
        "access_token": token,
        "token_type": "bearer",
        "usuario": {
            "id":     usuario.id,
            "nome":   usuario.nome,
            "email":  usuario.email,
            "perfil": usuario.perfil,
        }
    }


@router.post("/criar-usuario", status_code=201)
def criar_usuario(dados: dict, db: Session = Depends(get_db)):
    existente = db.query(Usuario).filter(
        Usuario.email == dados["email"]
    ).first()

    if existente:
        raise HTTPException(status_code=400, detail="Email já cadastrado")

    usuario = Usuario(
        nome       = dados["nome"],
        email      = dados["email"],
        senha_hash = pwd_context.hash(dados["senha"]),
        perfil     = dados.get("perfil", "operador"),
    )
    db.add(usuario)
    db.commit()
    db.refresh(usuario)

    return {
        "id":    usuario.id,
        "nome":  usuario.nome,
        "email": usuario.email
    }