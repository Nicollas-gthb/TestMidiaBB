from app.core.database import Base
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

class Historico(Base):
    __tablename__ = "historico"

    id = Column(Integer, primary_key=True, index=True)
    entidade = Column(String, nullable=False) # "midia" | "tv"
    entidade_id = Column(Integer, nullable=False)
    entidade_nome = Column(String, nullable=False) # nome no momento da ação
    acao = Column(String, nullable=False) # "adicionada" | "editada" | "removida"
    usuario_id = Column(Integer, nullable=False)
    usuario_nome = Column(String, nullable=False)    # nome no momento da ação

    criado_em = Column(DateTime(timezone=True), server_default=func.now())

