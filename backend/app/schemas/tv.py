from pydantic import BaseModel

from app.schemas.midia import MidiaResponse

class TVCreate(BaseModel):
    numero: int
    nome: str

class TVResponse(BaseModel):
    id: int
    numero: int
    nome: str
    ativo: bool
    midias: list[MidiaResponse] = []

    class Config:
        from_attributes = True

class TVUpdate(BaseModel):
    nome: str | None = None
    numero: int | None = None
    ativo: bool | None = None