from google import genai
import os
import json
import PIL.Image
from fastapi import HTTPException

# No SDK novo (google-genai), a chave vai direto no Client.
# Não existe mais o genai.configure()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def analyze_media(image_path: str):
    # Carrega a imagem
    img = PIL.Image.open(image_path)

    prompt = """
    Você é um sistema de análise de mídias corporativas do Banco do Brasil.
    Analise a imagem enviada e retorne um JSON seguindo este esquema:

    {
      "titulo": "string",
      "descricao": "string",
      "categoria": "marketing" | "informativo" | "institucional" | "alerta",
      "tempo_exibicao": number,
      "conteudo_seguro": boolean,
      "alerta": "string"
    }

    O tempo de exibição deve considerar: quantidade de texto, legibilidade e complexidade visual.
    Considere inadequado: nudez, violência, conteúdo ofensivo, política extremista ou incompatível com ambiente bancário.
    """

    try:
        # A chamada também mudou levemente no SDK novo
        response = client.models.generate_content(
            model="gemini-2.5-flash-lite", # Versão Lite costuma ter cota livre, 
            contents=[prompt, img],
            config={
                "response_mime_type": "application/json"
            }
        )

        return json.loads(response.text)
    
    except Exception as e:
        print(f"Erro na análise do Gemini: {e}")
        raise HTTPException(status_code=500, detail="IA indisponível no momento")