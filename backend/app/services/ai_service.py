from http.client import HTTPException

from openai import OpenAI
import base64
import os
import json

from backend.app.services.ocr_service import extract_text

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

    Retorne apenas JSON.
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": prompt
                }, {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{base64_image}"
                    }
                }
            ]
        }],
        max_tokens=300
    )

    content = response.choices[0].message.content

    # Remove possíveis blocos markdown
    content = content.replace("```json", "")
    content = content.replace("```", "")
    content = content.strip()

    try:

        return json.loads(content)
    
    except Exception as e:
        print(f"Erro na análise do GPT: {e}")
        raise HTTPException(status_code=500, detail="IA  indisponível no momento")