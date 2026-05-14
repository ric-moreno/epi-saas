from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, case
from app.database import get_db
from app.models.lancamento import Lancamento

router = APIRouter()

@router.get("/")
def listar_estoque(db: Session = Depends(get_db)):
    """
    Agrupa todos os lançamentos por código e calcula:
    - Total de entradas (qtde e R$)
    - Total de saídas (qtde e R$)
    - Saldo atual (entradas - saídas)
    """
    resultado = db.query(
        Lancamento.codigo,
        Lancamento.descricao,
        Lancamento.categoria,

        # Qtde total de entradas
        func.sum(
            case((Lancamento.tipo_mov == "ENTRADA", Lancamento.qtde), else_=0)
        ).label("qtde_entrada"),

        # Qtde total de saídas
        func.sum(
            case((Lancamento.tipo_mov == "SAÍDA", Lancamento.qtde), else_=0)
        ).label("qtde_saida"),

        # Saldo = entradas - saídas
        func.sum(
            case(
                (Lancamento.tipo_mov == "ENTRADA",  Lancamento.qtde),
                (Lancamento.tipo_mov == "SAÍDA",   -Lancamento.qtde),
                else_=0
            )
        ).label("saldo"),

        # Valor total de entradas
        func.sum(
            case((Lancamento.tipo_mov == "ENTRADA", Lancamento.rs_total), else_=0)
        ).label("valor_entrada"),

        # Valor total de saídas
        func.sum(
            case((Lancamento.tipo_mov == "SAÍDA", Lancamento.rs_total), else_=0)
        ).label("valor_saida"),

        # Último preço unitário registrado (para referência)
        func.max(Lancamento.rs_unitario).label("ultimo_preco"),

    ).filter(
        Lancamento.codigo != None,
        Lancamento.codigo != "",
    ).group_by(
        Lancamento.codigo,
        Lancamento.descricao,
        Lancamento.categoria,
    ).order_by(
        Lancamento.codigo
    ).all()

    return [
        {
            "codigo":        r.codigo,
            "descricao":     r.descricao,
            "categoria":     r.categoria,
            "qtde_entrada":  float(r.qtde_entrada or 0),
            "qtde_saida":    float(r.qtde_saida or 0),
            "saldo":         float(r.saldo or 0),
            "valor_entrada": float(r.valor_entrada or 0),
            "valor_saida":   float(r.valor_saida or 0),
            "ultimo_preco":  float(r.ultimo_preco or 0),
            "valor_saldo":   float(r.saldo or 0) * float(r.ultimo_preco or 0),
        }
        for r in resultado
    ]