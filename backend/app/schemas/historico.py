from pydantic import BaseModel
from datetime import datetime

class HistoricoResponse(BaseModel):
    id: int
    entidade: str
    entidade_id: int
    entidade_nome: str
    acao: str
    usuario_id: int
    usuario_nome: str
    criado_em: datetime

    class Config:
        from_attributes = True
