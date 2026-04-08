from pydantic import BaseModel

class MidiaResponse(BaseModel):
    id: int
    nome: str
    tipo: str
    arquivo: str
    duracao_segundos: int
    ativo: bool

    class Config:
        from_attributes = True