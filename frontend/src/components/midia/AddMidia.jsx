import { useEffect, useState } from "react"

import "./AddMidia.css"
import { Preview } from "./PreviewMidia"
import { api } from "../../api/axios"

export const AddMidia = ({ onClose, onSuccess }) => {

    const [togglePage, setTogglePage] = useState(1)
        
    const [nome, setNome] = useState("")
    const [data, setData] = useState("")
    const [duracao, setDuracao] = useState("")

    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState(null)


    const [tvsSelecionadas, setTvsSelecionadas] = useState([])

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
        if (e.target.id === "addmidia-container") {
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
        
        const formData = new FormData()
        formData.append("nome", nome)
        formData.append("arquivo", file)
        formData.append("duracao_segundos", duracao)
        formData.append("tv_ids", JSON.stringify(tvsSelecionadas))

        if (data) formData.append("validade", data)

        try {
            await api.post("/midias/upload", formData)
            onSuccess()
        } catch (error) {
            console.error("Erro ao fazer upload", error)
        }
    }

    return (
        <div id="addmidia-container" onClick={handleOutsideClick}>
            <div id="addmidia-content">

                <button 
                    className="close-button"
                    onClick={onClose}
                >
                    <i className="bi bi-x-circle"></i>
                </button>

                <h2>Nova Mídia</h2>

                <form id="addmidia-form-modal" className="addmidia-form" onSubmit={handleSubmit}>
                    {togglePage == 1 ? (
                        <>
                            <fieldset id="addmidia-field-nome" className="addmidia-field">
                                <legend className="addmidia-legend">Nome</legend>
                                <input
                                    id="addmidia-nome"
                                    className="addmidia-input"
                                    type="text"
                                    placeholder="Nome"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                />
                            </fieldset>

                            <label htmlFor="addmidia-input-upload" id="addmidia-label-upload">
                    
                                {preview ? (
                                    <>
                                        <button
                                            type="button"
                                            className="close-button"
                                            onClick={handleRemoveFile}
                                        >
                                            <i className="bi bi-x-circle"></i>
                                        </button>
                                        <Preview preview={preview} file={file} />
                                    </>
                                ) : (
                                    <span id="addmidia-span-upload">Escolha o arquivo <br /> Arquivos suportados: PNG, JPEG, MP4 </span>
                                )}
                    
                                <input
                                    id="addmidia-input-upload"
                                    className="addmidia-input"
                                    type="file"
                                    accept="image/*,video/*"
                                    placeholder="Upload"
                                    onChange={handleFileChange}
                                />
                            </label>

                            <fieldset id="addmidia-field-url" className="addmidia-field">
                                <legend className="addmidia-legend">URL</legend>
                                <p id="addmidia-output-url">{preview}</p>
                            </fieldset>
                    
                            <div id="addmidia-buttons-1" className="addmidia-buttons">
                                <button
                                    id="addmidia-next"
                                    className="action-button"
                                    type="button"
                                    onClick={handleNextPage}
                                >Avançar</button>
                            </div>
                        </>
                    ) : togglePage == 2 ? (
                        <>
                            <fieldset id="addmidia-field-duracao" className="addmidia-field">
                                <legend className="addmidia-legend">Duração</legend>
                                <input
                                    id="addmidia-duracao"
                                    className="addmidia-input"
                                    type="text"
                                    placeholder="Duração (em segundos)"
                                    value={duracao}
                                    onChange={(e) => setDuracao(e.target.value)}
                                />
                            </fieldset>

                            <fieldset id="addmidia-field-tvs" className="addmidia-field">
                                <legend className="addmidia-legend">TV Associada</legend>

                                <button type="button" className="second-action-button" id="addmidia-selectAll" onClick={handleToggleAllTvs}>
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

                            <fieldset id="addmidia-field-validade" className="addmidia-field">
                                <legend className="addmidia-legend">Validade</legend>
                                <input
                                    id="addmidia-validade"
                                    className="addmidia-input"
                                    type="date"
                                    placeholder="Validade"
                                    value={data}
                                    onChange={(e) => setData(e.target.value)}
                                />
                            </fieldset>

                            <div id="addmidia-buttons-2" className="addmidia-buttons">
                                <button
                                    id="addmidia-back"
                                    className="second-action-button"
                                    type="button"
                                    onClick={handlePreviousPage}
                                >Voltar</button>
                                <button
                                    id="addmidia-confirm"
                                    className="action-button"
                                    type="button"
                                    onClick={handleNextPage}
                                >Adicionar</button>
                            </div>
                        </>
                    ) : togglePage == 3 && file ? (
                        <>
                            <h2>Resumo</h2>
                            <div id="addmidia-resumo">
                                <p><strong>Nome:</strong> {nome}</p>
                                <p><strong>Tipo de midia: </strong>{
                                    file
                                        ? file.type.startsWith("image/")
                                            ? "Imagem"
                                            : file.type.startsWith("video/")
                                            ? "Vídeo"
                                            : "Desconhecido"
                                        : "Nenhuma mídia"
                                    
                                }</p>
                                <p><strong>Duração:</strong> {duracao} segundos</p>
                                <p><strong>Validade:</strong> {data}</p>
                                <p><strong>URL do arquivo:</strong> {preview}</p>
                                <p><strong>TVs:</strong> {
                                    tvs
                                    .filter(tv => tvsSelecionadas.includes(tv.id))
                                    .map(tv => tv.nome).join(", ")
                                }</p>
                                <div className="addmidia-buttons">
                                    <button
                                        id="addmidia-back"
                                        className="second-action-button"
                                        type="button"
                                        onClick={handlePreviousPage}
                                    >Voltar</button>
                                    <button
                                        id="addmidia-confirm"
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