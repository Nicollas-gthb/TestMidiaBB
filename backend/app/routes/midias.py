from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from datetime import date, datetime, timezone
import shutil, uuid, os

from app.core.database import get_session
from app.core.security import get_usuario_atual
from app.models.midia import Midia
from app.models.playlist_item import PlaylistItem
from app.models.tv import TV
from app.schemas.midia import MidiaResponse, MidiaUpdate
from app.services.historico_service import salvar_registro
from app.services.ai_service import analisar_midia

router = APIRouter(prefix="/api/midias", tags=["Mídias"])

UPLOAD_DIR = "/app/midias"
TEMP_ANALYZE_DIR = os.path.join(UPLOAD_DIR, "temp_ai")
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(TEMP_ANALYZE_DIR, exist_ok=True)

def parse_datetime(dt_str: str | None):
    if not dt_str:
        return None
    
    # Converte string para datetime
    dt = datetime.fromisoformat(dt_str)
    
    # Força UTC
    return dt.replace(tzinfo=timezone.utc)

def extrair_url(url: str) -> str:

    import re
    padrao = r"(?:v=|youtu\.be/|/live/|/shorts/)([a-zA-Z0-9_-]{11})"

    match = re.search(padrao, url)

    if not match:
        raise HTTPException(status_code=400, detail="URL do YouTube inválida")
    
    video_id = match.group(1)
    return f"https://www.youtube.com/embed/{video_id}?autoplay=1&mute=1&loop=1&playlist={video_id}"

@router.get("/", response_model=list[MidiaResponse])
async def listar_midias(session: Session = Depends(get_session)):
    return session.query(Midia).options(joinedload(Midia.tvs)).order_by(Midia.id).all()

@router.post("/upload", response_model=MidiaResponse)
async def upload_midia(
    nome: str = Form(...),
    duracao_segundos: int = Form(...),
    tv_ids: str = Form(...),
    inicio_exibicao: str | None = Form(None),
    expiracao: str | None = Form(None),
    arquivo: UploadFile | None = File(None),
    url_externa: str | None = Form(None),
    session: Session = Depends(get_session),
    usuario = Depends(get_usuario_atual)
):
    # Valida que veio pelo menos um dos dois
    if not arquivo and not url_externa:
        raise HTTPException(status_code=400, detail="Envie um arquivo ou uma URL externa")

    # Valida tipo
    if url_externa:
        embed_url = extrair_url(url_externa)
        tipo = "iframe"
        caminho = None
        url_salva = embed_url
    else:
        tipo = None
        if arquivo.content_type.startswith("image/"):
            tipo = "image"
        elif arquivo.content_type.startswith("video/"):
            tipo = "video"
        else:
            raise HTTPException(status_code=400, detail="Tipo de arquivo não suportado")

        # Salva arquivo
        extensao = arquivo.filename.split(".")[-1]
        nome_arquivo = f"{uuid.uuid4()}.{extensao}"
        caminho = os.path.join(UPLOAD_DIR, nome_arquivo)
        with open(caminho, "wb") as buffer:
            shutil.copyfileobj(arquivo.file, buffer)


    inicio = datetime.fromisoformat(inicio_exibicao).replace(tzinfo=timezone.utc) if inicio_exibicao else None
    expira = datetime.fromisoformat(expiracao).replace(tzinfo=timezone.utc) if expiracao else None
    
    # Cria mídia no banco
    midia = Midia(
        nome=nome,
        tipo=tipo,
        arquivo=caminho,
        url_externa=url_salva,
        duracao_segundos=duracao_segundos,
        inicio_exibicao=inicio,
        expiracao=expira
    )
    session.add(midia)
    session.flush()

    # Associa às TVs selecionadas
    import json
    ids = json.loads(tv_ids)
    if not isinstance(ids, list):
        ids = [ids]

    for tv_id in ids:
        tv = session.query(TV).filter(TV.id == tv_id, TV.ativo == True).first()
        if not tv:
            continue
        ultimo = session.query(PlaylistItem).filter(
            PlaylistItem.tv_id == tv_id
        ).count()

        item = PlaylistItem(tv_id=tv_id, midia_id=midia.id, ordem=ultimo + 1)
        session.add(item)

    salvar_registro(session, "midia", midia.id, midia.nome, "adicionada", usuario)

    session.commit()
    session.refresh(midia)
    return midia

@router.post("/analyze")
async def analise_midia(arquivo: UploadFile = File(...)): # Adicione async aqui
    if not arquivo.content_type.startswith(("image/", "video/")):
        raise HTTPException(status_code=400, detail="Tipo não suportado")

    extensao = arquivo.filename.split(".")[-1]
    caminho = os.path.join(TEMP_ANALYZE_DIR, f"{uuid.uuid4()}.{extensao}")

    try:
        with open(caminho, "wb") as buffer:
            shutil.copyfileobj(arquivo.file, buffer)
        
        return analisar_midia(caminho, arquivo.content_type)
    
    except HTTPException:
        raise

    except Exception as e:
        # Se a IA falhar, o FastAPI retorna 500 e o Axios cai no catch
        raise HTTPException(status_code=500, detail=str(e))
    
    finally:
        if os.path.exists(caminho):
            os.remove(caminho)

@router.delete("/{midia_id}")
async def deletar_midia(
    midia_id: int, 
    session: Session = Depends(get_session),
    usuario = Depends(get_usuario_atual)
):
    midia = session.query(Midia).filter(Midia.id == midia_id, Midia.ativo == True).first()
    if not midia:
        raise HTTPException(status_code=404, detail="Mídia não encontrada")

    midia.ativo = False
    session.query(PlaylistItem).filter(PlaylistItem.midia_id == midia_id).update({"ativo": False})

    salvar_registro(session, "midia", midia.id, midia.nome, "removida", usuario)

    session.commit()
    return {"message": "Mídia desativada com sucesso"}


@router.delete("/{midia_id}/hard")
async def hard_delete_midia(
    midia_id: int, 
    session: Session = Depends(get_session),
    usuario = Depends(get_usuario_atual)
):
    
    midia = session.query(Midia).filter(Midia.id == midia_id).first()

    
    if not midia:
        raise HTTPException(status_code=404, detail="Mídia não encontrada")

    session.query(PlaylistItem).filter(
        PlaylistItem.midia_id == midia_id
    ).delete()

    salvar_registro(session, "midia", midia.id, midia.nome, "deletada", usuario)
    session.commit()
    
    session.delete(midia)
    session.commit()

    return {"message": "Mídia deletada permanentemente"}

@router.patch("/{midia_id}", response_model=MidiaResponse)
async def atualizar_midia(
    midia_id: int, 
    request: MidiaUpdate,
    session: Session = Depends(get_session),
    usuario = Depends(get_usuario_atual)
):
    midia = session.query(Midia).filter(Midia.id == midia_id).first()

    if not midia:
        raise HTTPException(status_code=404, detail="Midia não encontrada")
    
    if request.nome is not None:
        midia.nome = request.nome
    if request.duracao_segundos is not None:
        midia.duracao_segundos = request.duracao_segundos

    if request.inicio_exibicao is not None:
        midia.inicio_exibicao = request.inicio_exibicao
    else:
        midia.inicio_exibicao = None
        

    if request.expiracao is not None:
        midia.expiracao = request.expiracao
    else:
        midia.expiracao = None

    if request.ativo is not None:
        midia.ativo = request.ativo

    if request.tv_ids is not None:
        session.query(PlaylistItem).filter(PlaylistItem.midia_id == midia.id).update({"ativo": False})

        for tv_id in request.tv_ids:

            item_existente = session.query(PlaylistItem).filter(
                PlaylistItem.midia_id == midia_id,
                PlaylistItem.tv_id == tv_id
            ).first()

            if item_existente:
                item_existente.ativo = True
            else:

                ultimo = session.query(PlaylistItem).filter(
                    PlaylistItem.tv_id == tv_id
                ).count()

                novo_item = PlaylistItem(
                    tv_id=tv_id, 
                    midia_id=midia_id, 
                    ordem=ultimo + 1
                )

                session.add(novo_item)
            
    salvar_registro(session, "midia", midia.id, midia.nome, "editada", usuario)


    session.commit()
    session.refresh(midia)
    return midia 