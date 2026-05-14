from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id         = Column(Integer, primary_key=True, index=True)
    nome       = Column(String(200), nullable=False)
    email      = Column(String(200), unique=True, index=True, nullable=False)
    senha_hash = Column(String(200), nullable=False)
    perfil     = Column(String(20), default="operador")  # admin, operador, consulta
    ativo      = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())