from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.lancamento import Lancamento

def calcular_saldo(db: Session, codigo: str) -> float:
    """
    Calcula saldo atual de um item.
    Entradas somam, Saídas subtraem.
    Equivale ao CalcularSaldo() do VBA.
    """
    resultado = db.query(
        func.sum(
            func.case(
                (Lancamento.tipo_mov == "ENTRADA",  Lancamento.qtde),
                (Lancamento.tipo_mov == "SAÍDA",   -Lancamento.qtde),
                else_=0
            )
        )
    ).filter(Lancamento.codigo == codigo).scalar()

    return float(resultado or 0)

def qtde_disponivel(db: Session, entrada_id: int) -> float:
    """
    Retorna quanto de uma ENTRADA ainda não foi consumido.
    Equivale ao QtdeDisponivelSimples() do VBA.
    """
    entrada = db.query(Lancamento).filter(
        Lancamento.id == entrada_id,
        Lancamento.tipo_mov == "ENTRADA"
    ).first()

    if not entrada:
        return 0.0

    # Soma todas as saídas vinculadas a esta entrada
    consumido = db.query(func.sum(Lancamento.qtde)).filter(
        Lancamento.entrada_vinculada == entrada_id,
        Lancamento.tipo_mov == "SAÍDA"
    ).scalar() or 0

    return float(entrada.qtde) - float(consumido)

def itens_proximos_vencimento(db: Session, dias: int = 30):
    """Retorna itens que vencem nos próximos X dias."""
    from datetime import date, timedelta
    limite = date.today() + timedelta(days=dias)
    return db.query(Lancamento).filter(
        Lancamento.data_vencimento <= limite,
        Lancamento.data_vencimento >= date.today(),
        Lancamento.tipo_mov == "ENTRADA",
        Lancamento.data_baixa == None
    ).all()