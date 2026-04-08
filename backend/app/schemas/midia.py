from pydantic import BaseModel
from typing import Optional
from datetime import date

class TVSimples(BaseModel):
    id: int
    numero: int
    nome: str

    class Config:
        from_attributes = True

class MidiaResponse(BaseModel):
    id: int
    nome: str
    tipo: str
    arquivo: str
    duracao_segundos: int
    validade: Optional[date] = None
    ativo: bool
    tvs: list[TVSimples] = []

    class Config:
        from_attributes = True