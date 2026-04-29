from app.models.historico import Historico

def salvar_registro(session, entidade, entidade_id, entidade_nome, acao, usuario):
    item = Historico(
        entidade=entidade,
        entidade_id=entidade_id,
        entidade_nome=entidade_nome,
        acao=acao,
        usuario_id=usuario.id,
        usuario_nome=usuario.nome
    )

    session.add(item)