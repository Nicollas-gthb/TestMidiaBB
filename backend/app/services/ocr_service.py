from PIL import Image
import pytesseract

import cv2
import os
import uuid

def extract_text(image_path: str):
    
    try:
        
        imagem = Image.open(image_path)

        texto = pytesseract.image_to_string(
            imagem, 
            lang="por"
        )

        return texto.strip()
    
    except Exception as e:

        print(f"Erro ao processar a imagem com Tesseract: {e}")
        return ""
    
def extract_videoframes(video_path: str, num_frames: int = 3):

    TEMP_FRAMES_DIR = "/app/temp_frames"

    os.makedirs(
        TEMP_FRAMES_DIR,
        exist_ok=True
    )

    video = cv2.VideoCapture(video_path) # Abre o video

    if not video.isOpened():
        raise Exception(
            "Erro ao abrir vídeo"
        )

    total_frames = int(
        video.get(cv2.CAP_PROP_FRAME_COUNT) # Conta os frames do video
    )

    if total_frames <= 0:
        raise Exception(
            "Vídeo sem frames válidos"
        )
    
    positions = [
        int(total_frames * 0.1),
        int(total_frames * 0.5),
        int(total_frames * 0.9)
        #define onde ou quando eu quero os frames
    ]

    frame_paths = []

    for pos in positions:

        video.set(
            cv2.CAP_PROP_POS_FRAMES,
            pos
        )

        success, frame = video.read()

        if success:

            frame_name = (
                f"{uuid.uuid4()}.jpg"
            )

            frame_path = os.path.join(
                TEMP_FRAMES_DIR,
                frame_name
            )

            cv2.imwrite(
                frame_path,
                frame
            )

            frame_paths.append(
                frame_path
            )

    video.release()

    return frame_paths