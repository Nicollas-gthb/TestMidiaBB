from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.core.database import get_session
from app.core.security import get_usuario_atual, get_usuario_admin
from app.models.tv import TV
from app.schemas.tv import TVCreate, TVResponse, TVUpdate
from app.services.historico_service import salvar_registro

router = APIRouter(prefix="/api/tv", tags=["TVs"])

@router.get("/", response_model=list[TVResponse])
def listar_tvs(session: Session = Depends(get_session)):
    return session.query(TV).options(joinedload(TV.midias)).order_by(TV.id).all()

@router.post("/", response_model=TVResponse)
def criar_tv(
    tv: TVCreate, 
    session: Session = Depends(get_session), 
    usuario = Depends(get_usuario_atual)
):
    
    existe = session.query(TV).filter(TV.numero == tv.numero).first()
    if existe:
        raise HTTPException(status_code=400, detail="Já existe uma TV com esse número")

    nova_tv = TV(numero=tv.numero, nome=tv.nome)
    session.add(nova_tv)

    salvar_registro(session, "tv", nova_tv.id, nova_tv.nome, "adicionada", usuario)

    session.commit()
    session.refresh(nova_tv)
    return nova_tv

@router.delete("/{tv_id}")
def deletar_tv(
    tv_id: int, 
    session: Session = Depends(get_session),
    usuario = Depends(get_usuario_atual)
):
    tv = session.query(TV).filter(TV.id == tv_id, TV.ativo == True).first()
    if not tv:
        raise HTTPException(status_code=404, detail="TV não encontrada")

    tv.ativo = False

    salvar_registro(session, "tv", tv.id, tv.nome, "removida", usuario)

    session.commit()
    return {"message": f"TV {tv.numero} desativada com sucesso"}


@router.delete("/{tv_id}/hard")
def hard_delete_tv(
    tv_id: int, 
    session: Session = Depends(get_session),
    usuario = Depends(get_usuario_atual)
):
    
    tv = session.query(TV).filter(TV.id == tv_id).first()
    if not tv:
        raise HTTPException(status_code=404, detail="TV não encontrada")
    
    salvar_registro(session, "tv", tv.id, tv.nome, "deletada", usuario)
    session.commit()

    session.delete(tv)
    session.commit()

    return {"message": "TV deletada permanentemente"}

@router.patch("/{tv_id}", response_model=TVResponse)
def atualizar_tv(
    tv_id: int, 
    request: TVUpdate,
    session: Session = Depends(get_session),
    usuario = Depends(get_usuario_atual)
):
    tv = session.query(TV).filter(TV.id == tv_id).first()

    if not tv:
        raise HTTPException(status_code=404, detail="TV não encontrada")
    
    if request.nome is not None:
        tv.nome = request.nome
    if request.numero is not None:
        tv.numero = request.numero
    if request.ativo is not None:
        tv.ativo = request.ativo

    salvar_registro(session, "tv", tv.id, tv.nome, "editada", usuario)

    session.commit()
    session.refresh(tv)
    return tv