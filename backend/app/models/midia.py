from sqlalchemy import Column, Date, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base

class Midia(Base): 
    __tablename__ = "midias"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    tipo = Column(String, nullable=False)  # "image" || "video"
    arquivo = Column(String, nullable=False)  # caminho do arquivo salvo
    validade = Column(Date, nullable=True)
    duracao_segundos = Column(Integer, nullable=False)
    ativo = Column(Boolean, default=True)
    criado_em = Column(DateTime(timezone=True), server_default=func.now())

    playlist_items = relationship("PlaylistItem", back_populates="midia")