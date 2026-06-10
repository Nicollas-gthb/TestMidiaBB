from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_session
from app.core.security import criptografar, get_usuario_atual, verificar_senha
from app.models.user import Usuario
from app.schemas.user import UsuarioCreate, UsuarioResponse, UsuarioUpdate, DeleteUserRequest
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

        if len(request.nome.strip()) < 8:
            raise HTTPException(status_code=400, detail="Nome muito curto")
        user_buscado.nome = request.nome

    if request.email is not None:

        email_duplicado = session.query(Usuario).filter(Usuario.email == request.email, Usuario.id != user_buscado.id).first()
        if email_duplicado:
            raise HTTPException(status_code=400, detail="Email ja cadastrado")
        user_buscado.email = request.email

    if request.senha is not None:

        if len(request.senha.strip()) < 5:
            raise HTTPException(status_code=400, detail="Senha muito curta")
        user_buscado.senha = criptografar(request.senha)

    if request.perfil is not None:

        if user_logado.perfil != "admin":
            raise HTTPException(status_code=403, detail="Apenas administradores podem alterar perfis.")
        
        user_buscado.perfil = request.perfil

    session.flush()

    salvar_registro(session, "usuario", user_buscado.id, user_buscado.nome, "editado", user_logado)

    session.commit()
    session.refresh(user_buscado)
    
    return user_buscado

@router.get("/{user_id}", response_model=UsuarioResponse)
async def buscar_usuario(
    user_id: int,
    session: Session = Depends(get_session)
):
    
    user_buscado = session.query(Usuario).filter(Usuario.id == user_id).first()

    return user_buscado

@router.delete("/{user_id}/hard")
async def hard_delete_user(
    user_id: int, 
    request: DeleteUserRequest,
    session: Session = Depends(get_session),
    usuario_logado = Depends(get_usuario_atual)
):
    
    
    user_delete = session.query(Usuario).filter(Usuario.id == user_id).first()

    if not user_delete:
        raise HTTPException(status_code=404, detail="Usuario não encontrado")
    
    if usuario_logado.perfil != "admin" and usuario_logado.id != user_delete.id:
        raise HTTPException(status_code=403, detail="Sem permissão para esta ação")
    
    if not verificar_senha(request.senha, usuario_logado.senha):
        raise HTTPException(status_code=403, detail="Sem permissão para esta ação")
    
    salvar_registro(session, "usuario", user_delete.id, user_delete.nome, "deletado", usuario_logado)
    session.flush()

    session.delete(user_delete)
    session.commit()

    return {"message": "Usuário deletado permanentemente"}