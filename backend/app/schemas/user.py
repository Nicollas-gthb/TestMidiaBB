from pydantic import BaseModel, EmailStr

class UsuarioCreate(BaseModel):
    nome: str
    email: EmailStr
    senha: str
    perfil: str = "operador"

class UsuarioResponse(BaseModel):
    id: int
    nome: str
    email: str
    perfil: str
    ativo: bool

    class Config:
        from_attributes = True

class UsuarioUpdate(BaseModel):
    nome: str | None = None
    email: EmailStr | None = None
    senha: str | None = None
    perfil: str | None = None
