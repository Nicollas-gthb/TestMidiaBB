from fastapi import APIRouter, Depends, HTTPException
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from datetime import date, datetime

from app.core.database import get_session
from app.models.tv import TV
from app.models.midia import Midia
from app.models.playlist_item import PlaylistItem
from app.schemas.playlist_item import PlaylistItemResponse

router = APIRouter(prefix="/api/tv", tags=["Playlist"])

@router.get("/{numero}/playlist", response_model=list[PlaylistItemResponse])
def get_playlist(numero: int, session: Session = Depends(get_session)):
    tv = session.query(TV).filter(TV.numero == numero, TV.ativo == True).first()
    if not tv:
        raise HTTPException(status_code=404, detail="TV não encontrada")

    agora = datetime.now()

    items = (
        session.query(PlaylistItem)
        .join(Midia)
        .filter(
            PlaylistItem.tv_id == tv.id,
            PlaylistItem.ativo == True,
            Midia.ativo == True,

            #Logica para não exibir a depender da data e horario
            (Midia.inicio_exibicao == None) | (Midia.inicio_exibicao <= agora),
            (Midia.expiracao == None) | (Midia.expiracao >= agora)
        )
        .order_by(PlaylistItem.criado_em)
        .all()
    )

    return items