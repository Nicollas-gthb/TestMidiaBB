from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_session
from app.core.security import verificar_senha, criar_access_token
from app.models.user import Usuario
from app.schemas.auth import LoginRequest, TokenResponse

router = APIRouter(prefix="/api/auth", tags=["Auth"])

@router.post("/login", response_model=TokenResponse)
def login(
    request: LoginRequest, 
    session: Session = Depends(get_session)
):

    usuario = session.query(Usuario).filter(
        Usuario.email == request.email,
        Usuario.ativo == True
    )

    if not usuario or not verificar_senha(request.senha, usuario.senha):
        raise HTTPException(status_code=401, status="Email ou senha invalidos")

    token = criar_access_token(usuario.id)

    return TokenResponse(access_token=token)