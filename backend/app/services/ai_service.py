# services/ai_service.py
import os
from fastapi import HTTPException

def analisar_midia(caminho: str, content_type: str) -> dict:
    """
    Roteador com fallback chain: GPT → Gemini → Claude
    Recebe o caminho do arquivo temporário e o content_type.
    """
    
    eh_video = content_type.startswith("video/")
    provedores = montar_chain(eh_video)

    if not provedores:
        raise HTTPException(status_code=503, detail="Nenhum provedor de IA configurado. Verifique as variáveis de ambiente.")

    erros = []

    for nome, funcao in provedores:
        try:
            print(f"[AI] Tentando {nome}...")
            resultado = funcao(caminho)
            resultado["provedor"] = nome
            print(f"[AI] Sucesso com {nome}")
            return resultado

        except HTTPException:
            # HTTPException dos services = IA retornou mas deu erro de parsing
            # Não re-lança, apenas registra e tenta o próximo
            print(f"[AI] {nome} falhou (HTTPException)")
            erros.append(nome)

        except Exception as e:
            print(f"[AI] {nome} falhou: {e}")
            erros.append(f"{nome}: {str(e)}")

    raise HTTPException(
        status_code=503,
        detail=f"Todos os provedores falharam: {', '.join(erros)}"
    )


def montar_chain(eh_video: bool) -> list:
    """
    Monta a lista de provedores disponíveis com base nas keys configuradas.
    Seleciona analyze_video ou analyze_media dependendo do tipo.
    """
    chain = []

    if os.getenv("OPENAI_API_KEY"):
        from app.services.gpt_service import analyze_media, analyze_video
        funcao = analyze_video if eh_video else analyze_media
        chain.append(("GPT-4o-mini", funcao))

    if os.getenv("GEMINI_API_KEY"):
        from app.services.gemini_service import analyze_media, analyze_video
        funcao = analyze_video if eh_video else analyze_media
        chain.append(("Gemini-2.5-flash-lite", funcao))

    if os.getenv("ANTHROPIC_API_KEY"):
        from app.services.claude_service import analyze_media, analyze_video
        funcao = analyze_video if eh_video else analyze_media
        chain.append(("Claude-Haiku-4.5", funcao))

    return chain