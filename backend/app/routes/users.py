from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_session
from app.core.security import criptografar, get_usuario_atual
from app.models.user import Usuario
from app.schemas.user import UsuarioCreate, UsuarioResponse, UsuarioUpdate
from app.services.historico_service import salvar_registro

router = APIRouter(prefix="/api/user", tags=["user"])

@router.post("/register", response_model=UsuarioResponse)
async def create(
        request: UsuarioCreate,
        session: Session = Depends(get_session)
):
    
    user_existe = session.query(Usuario).filter(Usuario.email == request.email).first()

    if user_existe:
        raise HTTPException(status_code=409, detail="Essa conta já existe")
    
    senha_criptografada = criptografar(request.senha)

    novo_usuario = Usuario(
        nome=request.nome,
        email=request.email,
        senha=senha_criptografada
    )

    session.add(novo_usuario)
    session.commit()
    session.refresh(novo_usuario)

    return novo_usuario

@router.get("/list", response_model=List[UsuarioResponse])
async def listar_usuarios(session: Session = Depends(get_session)):

    lista = session.query(Usuario).order_by(Usuario.id).all()
    return lista

@router.patch("/{user_id}", response_model=UsuarioResponse)
async def atualizar_usuario(
    user_id: int,
    request: UsuarioUpdate,
    user_logado: Usuario = Depends(get_usuario_atual),
    session: Session = Depends(get_session),
):
    
    user_buscado = session.query(Usuario).filter(Usuario.id == user_id).first()

    if not user_buscado:
        raise HTTPException(status_code=404, detail="Usuario não encontrado!")
    
    if user_logado.perfil != "admin" and user_logado.id != user_buscado.id:
        raise HTTPException(status_code=401, detail="Sem autorização!")
    
    if request.nome is not None:
        user_buscado.nome = request.nome

    if request.email is not None:
        user_buscado.email = request.email

    if request.senha is not None:
        user_buscado.senha = criptografar(request.senha)

    if request.perfil is not None:
        user_buscado.perfil = request.perfil

    session.flush()

    salvar_registro(session, "usuario", user_buscado.id, user_buscado.nome, "editado", user_logado)

    session.commit()
    session.refresh(user_buscado)
    
    return user_buscado