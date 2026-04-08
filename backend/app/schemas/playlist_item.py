from pydantic import BaseModel
from app.schemas.midia import MidiaResponse

class PlaylistItemResponse(BaseModel):
    id: int
    midia: MidiaResponse
    ordem: int

    class Config:
        from_attributes = True