# services/gemini_service.py
from google import genai
import os
import json
import PIL.Image
from fastapi import HTTPException

from app.services.ocr_service import extract_text, extract_videoframes

# No SDK novo (google-genai), a chave vai direto no Client.
# Não existe mais o genai.configure()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def analyze_media(image_path: str):
    # Carrega a imagem
    img = PIL.Image.open(image_path)

    # Extrai o texto da imagem usando OCR Tesseract
    texto_ocr = extract_text(image_path)

    prompt = f"""
    Você é um sistema de análise de mídias corporativas do Banco do Brasil.
    Analise a imagem enviada e retorne um JSON seguindo este esquema:

    Texto identificado na imagem:
    {texto_ocr}

    Analise a imagem enviada e retorne APENAS um JSON válido contendo:
    
    "titulo": "string",
    "descricao": "string",
    "categoria": "marketing" | "informativo" | "institucional" | "alerta",
    "tempo_exibicao": number,
    "conteudo_seguro": boolean,
    "alerta": "string"

    O tempo de exibição deve considerar: quantidade de texto, legibilidade e complexidade visual.
    Considere inadequado: nudez, violência, conteúdo ofensivo, política extremista ou incompatível com ambiente bancário.
    Caso seja inadequado, justifique no campo "alerta".
    """

    try:
        
        response = client.models.generate_content(
            model="gemini-2.5-flash-lite", # Versão Lite costuma ter cota livre, 
            contents=[prompt, img],
            max_tokens=500,
            config={
                "response_mime_type": "application/json"
            }
        )

        return json.loads(response.text)
    
    except Exception as e:
        print(f"Erro na análise do Gemini: {e}")
        raise HTTPException(status_code=500, detail="IA indisponível no momento")



def analyze_video(video_path: str):

    frames = extract_videoframes(video_path)
    ocr_results = []
    images = []

    for index, frame_path in enumerate(frames):

        # OCR do frame
        text = extract_text(frame_path)
        ocr_results.append(
            f"FRAME {index+1}:\n{text}"
        )

        # Abre imagem com PIL
        img = PIL.Image.open(frame_path)
        images.append(img)

    ocr_text = "\n\n".join(ocr_results)

    prompt = f"""
    Você está analisando frames extraídos de um único vídeo corporativo.

    Os frames representam:
    - início
    - meio
    - encerramento

    Texto identificado via OCR:

    {ocr_text}

    Retorne APENAS um JSON válido:

    Analise a imagem enviada e retorne APENAS um JSON válido contendo:
    
    "titulo": "string",
    "descricao": "string",
    "categoria": "marketing" | "informativo" | "institucional" | "alerta",
    "conteudo_seguro": boolean,
    "alerta": "string"


    Categorias:
    - marketing
    - informativo
    - institucional
    - alerta

    Considere inadequado:
    - nudez
    - violência
    - discurso ofensivo
    - conteúdo incompatível com ambiente bancário

    Caso seja inadequado, justifique no campo "alerta".
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents=[prompt, *images],
        config={
            "response_mime_type": "application/json"
        }
    )
    


    try:

        return json.loads(response.text)

    except Exception as e:
        print(f"Erro na análise do Gemini: {e}")
        raise HTTPException(status_code=500, detail="IA indisponível no momento")
    
    finally:
        for frame_path in frames:
            if os.path.exists(frame_path):
                os.remove(frame_path)

