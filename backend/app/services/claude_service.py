# services/claude_service.py
import anthropic
import base64
import os
import json
import PIL.Image
from fastapi import HTTPException

from app.services.ocr_service import extract_text, extract_videoframes

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def _encode_image(image_path: str) -> tuple[str, str]:
    """Converte imagem para base64. Retorna (base64, media_type)."""
    with open(image_path, "rb") as f:
        dados = base64.b64encode(f.read()).decode("utf-8")
    extensao = image_path.split(".")[-1].lower()
    media_type = "image/jpeg" if extensao in ("jpg", "jpeg") else f"image/{extensao}"
    return dados, media_type


PROMPT_BASE = """
    Você é um sistema de análise de mídias corporativas do Banco do Brasil.
    Analise a imagem enviada e retorne APENAS um JSON válido, sem texto adicional, sem markdown.

    Estrutura obrigatória:
    {
    "titulo": "string",
    "descricao": "string",
    "categoria": "marketing" | "informativo" | "institucional" | "alerta",
    "tempo_exibicao": number,
    "conteudo_seguro": boolean,
    "alerta": "string ou null"
    }

    O tempo de exibição deve considerar: quantidade de texto, legibilidade e complexidade visual.
    Considere inadequado: nudez, violência, conteúdo ofensivo, política extremista ou incompatível com ambiente bancário.
    Caso seja inadequado, justifique no campo "alerta".
    """


def analyze_media(image_path: str) -> dict:

    texto_ocr = extract_text(image_path)
    dados_b64, media_type = _encode_image(image_path)

    try:
        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=500,
            system=PROMPT_BASE,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": media_type,
                                "data": dados_b64
                            }
                        },
                        {
                            "type": "text",
                            "text": f"Texto extraído via OCR:\n{texto_ocr or '(nenhum texto detectado)'}"
                        }
                    ]
                }
            ]
        )

        return json.loads(response.content[0].text.strip())

    except Exception as e:
        print(f"Erro na análise do Claude: {e}")
        raise HTTPException(status_code=500, detail="IA indisponível no momento")


def analyze_video(video_path: str) -> dict:

    frames = extract_videoframes(video_path)
    ocr_results = []
    frames_content = []

    for index, frame_path in enumerate(frames):

        texto = extract_text(frame_path)
        ocr_results.append(f"FRAME {index + 1}:\n{texto}")

        dados_b64, media_type = _encode_image(frame_path)
        frames_content.append({
            "type": "image",
            "source": {
                "type": "base64",
                "media_type": media_type,
                "data": dados_b64
            }
        })

    ocr_text = "\n\n".join(ocr_results)

    prompt_video = f"""
Você está analisando frames extraídos de um único vídeo corporativo.
Os frames representam início, meio e encerramento do vídeo.

Texto identificado via OCR:
{ocr_text}

Retorne APENAS um JSON válido com a estrutura definida.
"""

    try:
        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=500,
            system=PROMPT_BASE,
            messages=[
                {
                    "role": "user",
                    "content": [
                        *frames_content,  # os 3 frames
                        {
                            "type": "text",
                            "text": prompt_video
                        }
                    ]
                }
            ]
        )

        return json.loads(response.content[0].text.strip())

    except Exception as e:
        print(f"Erro na análise do Claude (vídeo): {e}")
        raise HTTPException(status_code=500, detail="IA indisponível no momento")

    finally:
        for frame_path in frames:
            if os.path.exists(frame_path):
                os.remove(frame_path)