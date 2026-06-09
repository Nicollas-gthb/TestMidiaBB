from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from math import ceil
from datetime import date

from app.core.database import get_session
from app.core.security import get_usuario_atual
from app.models.historico import Historico
from app.schemas.historico import HistoricoResponse, HistoricoPaginaResponse

router = APIRouter(prefix="/api/historico", tags=["Histórico"])

@router.get("/list", response_model=HistoricoPaginaResponse)
async def historico_melhorado(
    pagina: int = 1,
    limite: int = 20,
    usuario: str | None = None,
    acao: str | None = None,
    data_inicio: date | None = None,
    data_fim: date | None = None,
    session: Session = Depends(get_session)
):

    query = session.query(Historico)

    if usuario:
        query = query.filter(
            Historico.usuario_nome.ilike(f"%{usuario}%"))

    if acao:
        query = query.filter(Historico.acao == acao)

    if data_inicio:
        query = query.filter(Historico.criado_em >= data_inicio)

    if data_fim:
        query = query.filter(Historico.criado_em <= data_fim)

    query = query.order_by(Historico.criado_em.desc())

    total = query.count()

    offset = (pagina - 1) * limite

    registros = (query.offset(offset).limit(limite).all())

    return {
        "pagina": pagina,
        "limite": limite,
        "total": total,
        "total_paginas": max(1, ceil(total / limite)),
        "dados": registros
    }

@router.get("/", response_model=list[HistoricoResponse])
def listar_historico(
    session: Session = Depends(get_session)
):
    
    historico = session.query(Historico).order_by(Historico.criado_em.desc()).limit(50).all()

    return historico

