from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, datetime, timezone

from app.core.database import get_session
from app.models.midia import Midia
from app.models.playlist_item import PlaylistItem
from app.models.tv import TV

router = APIRouter(prefix="/api/dashboard",tags=["Dashboard"])

@router.get("/media-types")
def media_types(
    session: Session = Depends(get_session)
):

    result = (
        session.query(
            Midia.tipo,
            func.count(Midia.id)
        )
        .group_by(Midia.tipo).all()
    )

    total = sum([item[1] for item in result])

    return {
        "total": total,
        "data": [
            {
                "name": tipo,
                "value": total
            }
            for tipo, total in result
        ]
    }


@router.get("/tv-midias")
def tv_midias(
    session: Session = Depends(get_session)
):

    tvs = session.query(TV).all()

    resultado = []

    for tv in tvs:

        total = (
            session.query(PlaylistItem)
            .filter(PlaylistItem.tv_id == tv.id)
            .count()
        )

        ativas = (
            session.query(PlaylistItem)
            .join(Midia)
            .filter(
                PlaylistItem.tv_id == tv.id,
                Midia.ativo == True
            )
            .count()
        )

        resultado.append({
            "tv": tv.nome,
            "total": total,
            "ativas": ativas,
            "status": tv.ativo
        })

    return resultado

@router.get("/media-status")
def media_status(
    session: Session = Depends(get_session)
):

    agora = datetime.now(timezone.utc)

    ativas = session.query(Midia).filter(
        Midia.ativo == True,
        Midia.inicio_exibicao < agora,
        Midia.expiracao > agora
    ).count()

    expiradas = session.query(Midia).filter(
        Midia.ativo == True,
        Midia.expiracao < agora
    ).count()

    agendadas = session.query(Midia).filter(
        Midia.ativo == True,
        Midia.inicio_exibicao > agora
    ).count()

    removidas = session.query(Midia).filter(
        Midia.ativo == False
    ).count()

    return [
        {
            "status": "Ativas",
            "valor": ativas,
            "fill": "#16ee48"
        },
        {
            "status": "Agendadas",
            "valor": agendadas,
            "fill": "#00ddff"
        },
        {
            "status": "Expiradas",
            "valor": expiradas,
            "fill": "#ffbf00"
        },
        {
            "status": "Removidas",
            "valor": removidas,
            "fill": "#ff0019"
        }
    ]