from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship

from app.core.database import Base

class TV(Base):

    __tablename__ = "tvs"

    id = Column(Integer, primary_key=True, index=True)
    numero = Column(Integer, unique=True, nullable=False)
    nome = Column(String, nullable=False)
    ativo = Column(Boolean, default=True)

    playlist = relationship("PlaylistItem", back_populates="tv")
    midias = relationship("Midia", secondary="playlist_items", viewonly=True)