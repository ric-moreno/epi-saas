from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, and_
from typing import Optional
from datetime import date
from app.database import get_db
from app.models.lancamento import Lancamento

router = APIRouter()

@router.get("/")
def listar_lancamentos(
    skip: int = 0,
    limit: int = 100,
    tipo: Optional[str] = None,
    codigo: Optional[str] = None,
    data_inicio: Optional[date] = None,
    data_fim: Optional[date] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Lancamento)

    if tipo:
        query = query.filter(Lancamento.tipo_mov == tipo.upper())
    if codigo:
        query = query.filter(Lancamento.codigo.ilike(f"%{codigo}%"))
    if data_inicio:
        query = query.filter(Lancamento.data >= data_inicio)
    if data_fim:
        query = query.filter(Lancamento.data <= data_fim)

    total = query.count()
    items = query.order_by(desc(Lancamento.id)).offset(skip).limit(limit).all()

    return {"total": total, "items": items}

@router.get("/{lancamento_id}")
def buscar_lancamento(lancamento_id: int, db: Session = Depends(get_db)):
    lanc = db.query(Lancamento).filter(Lancamento.id == lancamento_id).first()
    if not lanc:
        raise HTTPException(status_code=404, detail="Lançamento não encontrado")
    return lanc

@router.post("/", status_code=201)
def criar_lancamento(dados: dict, db: Session = Depends(get_db)):
    # Calcula R$ Total automaticamente
    qtde = float(dados.get("qtde", 0))
    rs_unit = float(dados.get("rs_unitario", 0))
    dados["rs_total"] = qtde * rs_unit

    lanc = Lancamento(**dados)
    db.add(lanc)
    db.commit()
    db.refresh(lanc)
    return lanc

@router.put("/{lancamento_id}")
def editar_lancamento(lancamento_id: int, dados: dict, db: Session = Depends(get_db)):
    lanc = db.query(Lancamento).filter(Lancamento.id == lancamento_id).first()
    if not lanc:
        raise HTTPException(status_code=404, detail="Lançamento não encontrado")

    for campo, valor in dados.items():
        setattr(lanc, campo, valor)

    db.commit()
    db.refresh(lanc)
    return lanc

@router.delete("/{lancamento_id}", status_code=204)
def excluir_lancamento(lancamento_id: int, db: Session = Depends(get_db)):
    lanc = db.query(Lancamento).filter(Lancamento.id == lancamento_id).first()
    if not lanc:
        raise HTTPException(status_code=404, detail="Lançamento não encontrado")
    db.delete(lanc)
    db.commit()