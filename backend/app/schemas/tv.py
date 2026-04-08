from pydantic import BaseModel

class TVCreate(BaseModel):
    numero: int
    nome: str

class TVResponse(BaseModel):
    id: int
    numero: int
    nome: str
    ativo: bool

    class Config:
        from_attributes = True