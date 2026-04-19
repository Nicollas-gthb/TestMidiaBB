from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_session
from app.core.security import criptografar
from app.models.user import Usuario
from app.schemas.user import UsuarioCreate, UsuarioResponse

router = APIRouter(prefix="/api/user", tags=["user"])

@router.post("/register", response_model=UsuarioResponse)
def create(
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