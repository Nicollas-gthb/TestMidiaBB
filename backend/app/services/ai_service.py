from http.client import HTTPException

from openai import OpenAI
import base64
import os
import json

from backend.app.services.ocr_service import extract_text, extract_videoframes

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

def encode_image(image_path: str):

    with open(image_path, "rb") as image_file:
        return base64.b64encode(
            image_file.read()
        ).decode("utf-8")


def analyze_media(image_path: str):

    base64_image = encode_image(image_path)

    # Extrai o texto da imagem usando OCR Tesseract
    texto_ocr = extract_text(image_path)

    prompt = f"""
    Você é um sistema de análise de mídias corporativas do Banco do Brasil.
    Analise a imagem enviada e retorne APENAS um JSON válido contendo:

    Texto identificado na imagem:
    {texto_ocr}

    {
      "titulo": "string",
      "descricao": "string",
      "categoria": "marketing" | "informativo" | "institucional" | "alerta",
      "tempo_exibicao": number,
      "conteudo_seguro": boolean,
      "alerta": "string"
    }

    Categorias permitidas:
    - marketing
    - informativo
    - institucional
    - alerta

    O tempo de exibição deve considerar:
    - quantidade de texto
    - legibilidade
    - complexidade visual

    Considere inadequado:
    - nudez
    - violência
    - conteúdo ofensivo
    - discurso político extremista
    - qualquer conteúdo incompatível com ambiente bancário.

    Caso seja inadequado, justifique no campo "alerta".

    Retorne apenas JSON.
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{
            "role": "user",
            "content": [
                {"type": "text", "text": prompt},

                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}}
            ]
        }],
        max_tokens=300
    )

    result = response.choices[0].message.content

    # Remove possíveis blocos markdown
    result = result.replace("```json", "")
    result = result.replace("```", "")
    result = result.strip()

    try:

        return json.loads(result)
    
    except Exception as e:
        print(f"Erro na análise do GPT: {e}")
        raise HTTPException(status_code=500, detail="IA  indisponível no momento")



def analyze_video(video_path: str):
    
    frames = extract_videoframes(video_path)
    ocr_results = []
    encoded_frames = []

    for index, frame_path in enumerate(frames):

        # OCR do frame
        text = extract_text(frame_path)

        # Adiciona texto OCR
        ocr_results.append(
            f"FRAME {index+1}:\n{text}"
        )

        # Converte imagem para Base64
        encoded_frames.append(
            encode_image(frame_path)
        )

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

    {{
    "titulo": "",
    "descricao": "",
    "categoria": "",
    "conteudo_seguro": true,
    "alerta": ""
    }}

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

    content = [{"type": "text", "text": prompt}]

    # Adiciona os frames ao content
    for base64_frame in encoded_frames:

        content.append(
            {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_frame}"}}
        )

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{
            "role": "user",
            "content": content
        }],
        max_tokens=500
    )

    result = response.choices[0].message.content

    # Remove possíveis blocos markdown
    result = result.replace("```json", "")
    result = result.replace("```", "")
    result = result.strip()

    # Remove os frames temporários
    for frame_path in frames:

        if os.path.exists(frame_path):
            os.remove(frame_path)

    try:

        return json.loads(result)
    
    except Exception as e:
        print(f"Erro na análise do GPT: {e}")
        raise HTTPException(status_code=500, detail="IA  indisponível no momento")