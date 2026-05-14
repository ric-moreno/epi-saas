from sqlalchemy import Column, Integer, String, Numeric, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Lancamento(Base):
    __tablename__ = "lancamentos"

    id                = Column(Integer, primary_key=True, index=True)
    data              = Column(Date, nullable=False)
    matr_cnpj         = Column(String(20))
    nome              = Column(String(200))
    tipo_mov          = Column(String(10), nullable=False)  # ENTRADA ou SAÍDA
    justificativa     = Column(String(100))
    categoria         = Column(String(50))
    codigo            = Column(String(30), index=True)
    descricao         = Column(String(200))
    qtde              = Column(Numeric(10, 3))
    rs_unitario       = Column(Numeric(12, 2))
    rs_total          = Column(Numeric(14, 2))
    data_vencimento   = Column(Date)
    ca                = Column(String(20))
    nr_serie          = Column(String(50))
    nota_fiscal       = Column(String(30))
    data_baixa        = Column(Date)
    motivo_baixa      = Column(String(200))
    vida_util         = Column(Integer)  # em dias
    observacao        = Column(String(500))
    entrada_vinculada = Column(Integer, ForeignKey("lancamentos.id"))
    created_at        = Column(DateTime(timezone=True), server_default=func.now())
    updated_at        = Column(DateTime(timezone=True), onupdate=func.now())

    # Relacionamento recursivo (entrada referencia outra entrada)
    vinculo = relationship("Lancamento", remote_side=[id])