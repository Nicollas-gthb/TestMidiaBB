from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.models.model import Usuario
from app.core.database import get_session

from dotenv import load_dotenv
import os


load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_HOURS = int(os.getenv("ACCESS_TOKEN_EXPIRE_HOURS"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS"))

#variavel para criptografar
bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def criptografar(senha: str) -> str:
    return bcrypt_context.hash(senha)

def verificar_senha(senha: str, senha_hash: str) -> bool:
    return bcrypt_context.verify(senha, senha_hash)


#token
def criar_access_token(id_usuario):

    data_expiracao = datetime.now(timezone.utc) + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    dictionary_info = {
        "sub": str(id_usuario),
        "exp": data_expiracao,
        "type": "access"
    }
    jwt_code = jwt.encode(dictionary_info, SECRET_KEY, algorithm=ALGORITHM)
    return jwt_code


def criar_refresh_token(id_usuario):

    data_expiracao = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    dictionary_info = {
        "sub": str(id_usuario),
        "exp": data_expiracao,
        "type": "refresh"
    }
    jwt_code = jwt.encode(dictionary_info, SECRET_KEY, algorithm=ALGORITHM)
    return jwt_code


#oauth2
oauth2_schema = OAuth2PasswordBearer(tokenUrl="/auth/login")

#função para bloquear rotas, exigindo um token
async def get_usuario_atual(
        token: str = Depends(oauth2_schema),
        session: Session = Depends(get_session)
    ):

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))
    except JWTError:
        raise HTTPException(status_code=401, detail="Token access inválido")
    
    usuario = session.query(Usuario).filter(Usuario.id == user_id).first()
    if not usuario:
        raise HTTPException(status_code=401, detail="Usuario não encontrado")
    
    return usuario

async def get_usuario_admin(
        usuario_atual: Usuario = Depends(get_usuario_atual)
    ):

    if not usuario_atual.admin:
        raise HTTPException(status_code=403, detail="Operação restrita a administradores.")
    
    return usuario_atual