import { useEffect, useState } from "react"

import "./EditMidia.css"
import { api } from "../../api/axios"
import { toUTC } from "../../utils/formatters"
import { Preview } from "./PreviewMidia"

export const EditMidia = ({ item, onClose, onSuccess }) => {

    const [togglePage, setTogglePage] = useState(1)

    const [nome, setNome] = useState(item.nome)
    const [duracao, setDuracao] = useState(item.duracao_segundos)
    const [exibicao, setExibicao] = useState(
        item.inicio_exibicao
        ? new Date(item.inicio_exibicao).toISOString().slice(0, 16)
        : ""
    ) 
    const [expiracao, setExpiracao] = useState(
        item.expiracao
        ? new Date(item.expiracao).toISOString().slice(0, 16)
        : ""
    ) 
    const [ativo, setAtivo] = useState(item.ativo)
    const [tvsSelecionadas, setTvsSelecionadas] = useState(
        item.tvs.map(tv => tv.id)
    )
    

    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState(null)

    const [tvs, setTvs] = useState([])

    useEffect(() => {
        api.get("/tv/").then(res => setTvs(res.data))
    }, [])

    const todasTvsSelecionadas = tvsSelecionadas.length === tvs.length

    const handleToggleTv = (id) => {
        setTvsSelecionadas(prev => 
            prev.includes(id)
            ? prev.filter(tvId => tvId !== id)
            : [...prev, id]
        )
    }

    const handleToggleAllTvs = () => {
        todasTvsSelecionadas ? 
        setTvsSelecionadas([]) :
        setTvsSelecionadas(tvs.map(tv => tv.id))
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        if(!selectedFile) return

        setFile(selectedFile)

        const previewUrl = URL.createObjectURL(selectedFile)
        setPreview(previewUrl)
    }

    const handleRemoveFile = () => {
        if (preview) {
            URL.revokeObjectURL(preview)
        }
        setFile(null)
        setPreview(null)
    }

    const handleOutsideClick = (e) => {
        if(e.target.id === "editmidia-container"){
            onClose()
        }
    }

    const handleNextPage = (e) => {
        e.preventDefault()
        if(togglePage < 3){
            setTogglePage(togglePage + 1)
        }
    }

    const handlePreviousPage = (e) => {
        e.preventDefault()
        if(togglePage > 1){
            setTogglePage(togglePage - 1)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const payload = {
            nome,
            duracao_segundos: parseInt(duracao),
            ativo,
            tv_ids: tvsSelecionadas,
            inicio_exibicao: exibicao ? toUTC(exibicao) : null,
            expiracao: expiracao ? toUTC(expiracao) : null,
        }

        try{
            await api.patch(`/midias/${item.id}`, payload)
            onSuccess()
        }catch(error){
            const mensagem = error.response?.data?.detail || "Erro ao atualizar midia"
        }
    }

    return (
        
        
        <div id="editmidia-container" onClick={handleOutsideClick}>
            <div id="editmidia-content">

                <button 
                    className="close-button"
                    onClick={onClose}
                >
                    <i className="bi bi-x-circle"></i>
                </button>

                <h2>Editar Mídia</h2>
                <p>ID: {item.id}</p>

                <form id="editmidia-form-modal" className="addmidia-form" onSubmit={handleSubmit}>
                    {togglePage == 1 ? (
                        <>
                            <fieldset id="editmidia-field-nome" className="addmidia-field">
                                <legend className="addmidia-legend">Nome</legend>
                                <input
                                    id="editmidia-nome"
                                    className="addmidia-input"
                                    type="text"
                                    placeholder="Nome"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                />
                            </fieldset>

                            <fieldset id="editmidia-field-duracao" className="addmidia-field">
                                <legend className="addmidia-legend">Duração</legend>
                                <input
                                    id="editmidia-duracao"
                                    className="addmidia-input"
                                    type="text"
                                    placeholder="padrão 3 segundos"
                                    value={duracao}
                                    onChange={(e) => setDuracao(e.target.value)}
                                />
                            </fieldset>

                            <fieldset id="editmidia-field-exibicao" className="addmidia-field">
                                <legend className="addmidia-legend">Inicio da exibição</legend>
                                <input
                                    id="editmidia-exibicao"
                                    className="addmidia-input"
                                    type="datetime-local"
                                    placeholder="Data e hora de inicio"
                                    value={exibicao}
                                    onChange={(e) => setExibicao(e.target.value)}
                                />
                            </fieldset>

                            <fieldset id="editmidia-field-expiracao" className="addmidia-field">
                                <legend className="addmidia-legend">Expiração</legend>
                                <input
                                    id="editmidia-expiracao"
                                    className="addmidia-input"
                                    type="datetime-local"
                                    placeholder="Data e hora de fim"
                                    value={expiracao}
                                    onChange={(e) => setExpiracao(e.target.value)}
                                />
                            </fieldset>

                            
                    
                            <div id="editmidia-buttons-1" className="addmidia-buttons">
                                <button
                                    id="editmidia-next"
                                    className="action-button"
                                    type="button"
                                    onClick={handleNextPage}
                                >Avançar</button>
                            </div>
                        </>
                    ) : togglePage == 2 ? (
                        <>
                            

                            <fieldset id="editmidia-field-tvs" className="addmidia-field">
                                <legend className="addmidia-legend">TV Associada</legend>

                                <button type="button" className="second-action-button" id="editmidia-selectAll" onClick={handleToggleAllTvs}>
                                    {todasTvsSelecionadas ? "Desmarcar Todas" : "Marcar Todas"}
                                </button>

                                <div className="addmidia-tvs-list">
                                    {tvs.map(tv => (
                                        <label key={tv.id} className="addmidia-tv-item">
                                            <input
                                                id={`tv-${tv.id}`}
                                                className="addmidia-opcoes-tv"
                                                type="checkbox"
                                                checked={tvsSelecionadas.includes(tv.id)}
                                                onChange={() => handleToggleTv(tv.id)}
                                            />
                                            TV {tv.numero} — {tv.nome}
                                        </label>
                                    ))}
                                </div>
                            </fieldset>

                            <fieldset className="addmidia-field">
                                <legend className="addmidia-legend">Status</legend>
                                <label className="addmidia-tv-item">
                                    <input
                                        type="checkbox"
                                        checked={ativo}
                                        onChange={(e) => setAtivo(e.target.checked)}
                                    />
                                    Mídia ativa
                                </label>
                            </fieldset>

                            <div id="editmidia-buttons-2" className="addmidia-buttons">
                                <button
                                    id="editmidia-back"
                                    className="second-action-button"
                                    type="button"
                                    onClick={handlePreviousPage}
                                >Voltar</button>
                                <button
                                    id="editmidia-confirm"
                                    className="action-button"
                                    type="button"
                                    onClick={handleNextPage}
                                >Adicionar</button>
                            </div>
                        </>
                    ) : togglePage == 3 ? (
                        <>
                            <h2>Resumo</h2>
                            <div id="editmidia-resumo">
                                <p><strong>Nome:</strong> {nome}</p>
                                <p><strong>Duração:</strong> {duracao || "(padrão) 5"} segundos</p>
                                <p><strong>Inicio da exibição:</strong> {exibicao || "Imediato"}</p>
                                <p><strong>Fim da exibição:</strong> {expiracao || "Sem expiração"}</p>
                                <p><strong>TVs:</strong> {
                                    tvs
                                    .filter(tv => tvsSelecionadas.includes(tv.id))
                                    .map(tv => tv.nome).join(", ")
                                }</p>
                                <div className="addmidia-buttons">
                                    <button
                                        id="editmidia-back"
                                        className="second-action-button"
                                        type="button"
                                        onClick={handlePreviousPage}
                                    >Voltar</button>
                                    <button
                                        id="editmidia-confirm"
                                        className="action-button"
                                        type="submit"
                                        onClick={handleSubmit}
                                    >Confirmar</button>
                                </div>
                            </div>
                    
                        </>
                    ) : (
                        <p>Erro ao carregar recurso</p>
                    )}
                </form>
            </div>
        </div>
        
        
    )
}