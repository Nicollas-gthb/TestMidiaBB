from sqlalchemy import Column, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class PlaylistItem(Base):
    __tablename__ = "playlist_items"

    id = Column(Integer, primary_key=True, index=True)
    tv_id = Column(Integer, ForeignKey("tvs.id"), nullable=False)
    midia_id = Column(Integer, ForeignKey("midias.id"), nullable=False)
    ordem = Column(Integer, nullable=False)
    ativo = Column(Boolean, default=True)
    criado_em = Column(DateTime(timezone=True), server_default=func.now())

    tv = relationship("TV", back_populates="playlist")
    midia = relationship("Midia", back_populates="playlist_items")