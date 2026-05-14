from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import Optional
from datetime import date
from app.database import get_db
from app.models.lancamento import Lancamento

router = APIRouter()


# ── GET /lancamentos ──────────────────────────────────────────
@router.get("/")
def listar(
    skip: int = 0,
    limit: int = 50,
    tipo: Optional[str] = None,
    codigo: Optional[str] = None,
    nome: Optional[str] = None,
    data_inicio: Optional[date] = None,
    data_fim: Optional[date] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Lancamento)

    if tipo:
        query = query.filter(Lancamento.tipo_mov == tipo.upper())
    if codigo:
        query = query.filter(Lancamento.codigo.ilike(f"%{codigo}%"))
    if nome:
        query = query.filter(Lancamento.nome.ilike(f"%{nome}%"))
    if data_inicio:
        query = query.filter(Lancamento.data >= data_inicio)
    if data_fim:
        query = query.filter(Lancamento.data <= data_fim)

    total = query.count()
    itens = query.order_by(desc(Lancamento.id)).offset(skip).limit(limit).all()

    return {"total": total, "itens": itens}


# ── GET /lancamentos/{id} ─────────────────────────────────────
@router.get("/{lancamento_id}")
def buscar(lancamento_id: int, db: Session = Depends(get_db)):
    lanc = db.query(Lancamento).filter(
        Lancamento.id == lancamento_id
    ).first()

    if not lanc:
        raise HTTPException(status_code=404, detail="Lançamento não encontrado")
    return lanc


# ── POST /lancamentos ─────────────────────────────────────────
@router.post("/", status_code=201)
def criar(dados: dict, db: Session = Depends(get_db)):
    # Calcula R$ Total automaticamente
    qtde    = float(dados.get("qtde") or 0)
    rs_unit = float(dados.get("rs_unitario") or 0)
    dados["rs_total"] = qtde * rs_unit

    # Garante que tipo_mov vai em maiúsculo
    if "tipo_mov" in dados:
        dados["tipo_mov"] = dados["tipo_mov"].upper()

    lanc = Lancamento(**dados)
    db.add(lanc)
    db.commit()
    db.refresh(lanc)
    return lanc


# ── PUT /lancamentos/{id} ─────────────────────────────────────
@router.put("/{lancamento_id}")
def editar(lancamento_id: int, dados: dict, db: Session = Depends(get_db)):
    lanc = db.query(Lancamento).filter(
        Lancamento.id == lancamento_id
    ).first()

    if not lanc:
        raise HTTPException(status_code=404, detail="Lançamento não encontrado")

    # Recalcula R$ Total se qtde ou valor unitário mudou
    qtde    = float(dados.get("qtde") or lanc.qtde or 0)
    rs_unit = float(dados.get("rs_unitario") or lanc.rs_unitario or 0)
    dados["rs_total"] = qtde * rs_unit

    for campo, valor in dados.items():
        setattr(lanc, campo, valor)

    db.commit()
    db.refresh(lanc)
    return lanc


# ── DELETE /lancamentos/{id} ──────────────────────────────────
@router.delete("/{lancamento_id}", status_code=204)
def excluir(lancamento_id: int, db: Session = Depends(get_db)):
    lanc = db.query(Lancamento).filter(
        Lancamento.id == lancamento_id
    ).first()

    if not lanc:
        raise HTTPException(status_code=404, detail="Lançamento não encontrado")

    db.delete(lanc)
    db.commit()