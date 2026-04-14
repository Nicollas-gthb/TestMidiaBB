from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.core.database import get_session
from app.core.security import get_usuario_atual, get_usuario_admin
from app.models.tv import TV
from app.schemas.tv import TVCreate, TVResponse

router = APIRouter(prefix="/api/tv", tags=["TVs"])

@router.get("/", response_model=list[TVResponse])
def listar_tvs(session: Session = Depends(get_session)):
    return session.query(TV).filter(TV.ativo == True).options(joinedload(TV.midias)).all()

@router.post("/", response_model=TVResponse)
def criar_tv(tv: TVCreate, session: Session = Depends(get_session)):
    existe = session.query(TV).filter(TV.numero == tv.numero).first()
    if existe:
        raise HTTPException(status_code=400, detail="Já existe uma TV com esse número")

    nova_tv = TV(numero=tv.numero, nome=tv.nome)
    session.add(nova_tv)
    session.commit()
    session.refresh(nova_tv)
    return nova_tv

@router.delete("/{tv_id}")
def deletar_tv(tv_id: int, session: Session = Depends(get_session)):
    tv = session.query(TV).filter(TV.id == tv_id, TV.ativo == True).first()
    if not tv:
        raise HTTPException(status_code=404, detail="TV não encontrada")

    tv.ativo = False
    session.commit()
    return {"message": f"TV {tv.numero} desativada com sucesso"}