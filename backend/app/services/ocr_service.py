from PIL import Image
import pytesseract


def extract_text(image_path: str):
    
    try:
        
        imagem = Image.open(image_path)

        texto = pytesseract.image_to_string(
            imagem, 
            lang="por"
        )

        return texto.strip()
    
    except Exception as e:

        print(f"Erro ao processar a imagem: {e}")
        return ""
    