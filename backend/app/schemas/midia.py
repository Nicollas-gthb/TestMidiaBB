from pydantic import BaseModel
from typing import Optional
from datetime import date

class MidiaResponse(BaseModel):
    id: int
    nome: str
    tipo: str
    arquivo: str
    duracao_segundos: int
    validade: Optional[date] = None
    ativo: bool

    class Config:
        from_attributes = True