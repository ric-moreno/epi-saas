from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from datetime import date, timedelta
from app.database import get_db
from app.models.lancamento import Lancamento

router = APIRouter()

@router.get("/resumo")
def resumo(db: Session = Depends(get_db)):
    hoje      = date.today()
    inicio_mes = hoje.replace(day=1)
    limite_30  = hoje + timedelta(days=30)

    # Total de lançamentos
    total = db.query(func.count(Lancamento.id)).scalar()

    # Entradas do mês
    entradas_mes = db.query(func.sum(Lancamento.rs_total)).filter(
        Lancamento.tipo_mov == "ENTRADA",
        Lancamento.data >= inicio_mes,
    ).scalar() or 0

    # Saídas do mês
    saidas_mes = db.query(func.sum(Lancamento.rs_total)).filter(
        Lancamento.tipo_mov == "SAÍDA",
        Lancamento.data >= inicio_mes,
    ).scalar() or 0

    # Vencimentos próximos (30 dias)
    vencimentos = db.query(func.count(Lancamento.id)).filter(
        Lancamento.data_vencimento != None,
        Lancamento.data_vencimento <= limite_30,
        Lancamento.data_vencimento >= hoje,
    ).scalar() or 0

    return {
        "total_lancamentos":    total,
        "total_entradas_mes":   float(entradas_mes),
        "total_saidas_mes":     float(saidas_mes),
        "vencimentos_proximos": vencimentos,
    }


@router.get("/vencimentos")
def vencimentos(db: Session = Depends(get_db)):
    hoje     = date.today()
    limite   = hoje + timedelta(days=30)

    return db.query(Lancamento).filter(
        Lancamento.data_vencimento != None,
        Lancamento.data_vencimento >= hoje,
        Lancamento.data_vencimento <= limite,
    ).order_by(Lancamento.data_vencimento).limit(20).all()