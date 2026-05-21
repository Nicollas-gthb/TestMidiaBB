from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

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

    return [
        {
            "name": tipo,
            "value": total
        }
        for tipo, total in result
    ]


@router.get("/tv-midias")
def tv_midias(
    session: Session = Depends(get_session)
):

    result = (
        session.query(
            TV.nome,
            func.count(PlaylistItem.id)
        )
        .join(PlaylistItem, PlaylistItem.tv_id == TV.id)
        .group_by(TV.nome)
        .all()
    )

    return [
        {
            "tv": nome,
            "midias": total
        }
        for nome, total in result
    ]