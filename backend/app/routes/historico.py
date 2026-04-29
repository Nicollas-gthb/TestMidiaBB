from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_session
from app.core.security import get_usuario_atual
from app.models.historico import Historico
from app.schemas.historico import HistoricoResponse

router = APIRouter(prefix="/api/historico", tags=["Histórico"])

@router.get("/", response_model=list[HistoricoResponse])
def listar_historico(
    session: Session = Depends(get_session)
):
    
    historico = session.query(Historico).order_by(Historico.criado_em.desc()).limit(50).all()

    return historico