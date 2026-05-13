import { useEffect, useState } from "react"

import "./AddMidia.css"
import { Preview } from "./PreviewMidia"
import { api } from "../../api/axios"
import { toUTC } from "../../utils/formatters"
import { useToast } from "../../contexts/ToastContext"

export const AddMidia = ({ onClose, onSuccess }) => {

    const [analiseIA, setAnaliseIA] = useState(null)
    const [modalIAaberto, setModalIAaberto] = useState(false)
    const [loadingIA, setLoadingIA] = useState(false)


    const { addToast } = useToast()

    const [togglePage, setTogglePage] = useState(1)
        
    const [nome, setNome] = useState("")
    const [exibicao, setExibicao] = useState("") 
    const [expiracao, setExpiracao] = useState("") 
    const [duracao, setDuracao] = useState("3")
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

    const handleAnalyseAI = async (e) => {
        e.preventDefault()

        if(!file){
            addToast("Insira uma midia primeiro", "aviso")
            return
        }

        setLoadingIA(true)

        try{
            
            const formData = new FormData()
            formData.append("arquivo", file)

            const response = await api.post("/midias/analyze", formData)

            const data = response.data
            setAnaliseIA(data)


            // AUTO PREENCHIMENTO
            setNome(data.titulo)
            setDuracao(data.tempo_exibicao)

            setModalIAaberto(true)

            addToast("Análise concluída!", "sucesso")
        }catch(error){
            console.error("Erro detalhado:", error.response?.data || error.message)
            addToast("Erro ao analisar analise !", "erro")
        }finally{
            setLoadingIA(false)
        }

    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        const formData = new FormData()
        formData.append("nome", nome)
        formData.append("arquivo", file)
        formData.append("duracao_segundos", duracao)
        formData.append("tv_ids", JSON.stringify(tvsSelecionadas))

        if (exibicao) formData.append("inicio_exibicao", toUTC(exibicao))
        if (expiracao) formData.append("expiracao", toUTC(expiracao))


        try {
            await api.post("/midias/upload", formData)
            addToast("Upload realizado !", "sucesso")
            onSuccess()
        } catch (error) {
            const mensagem = error.response?.data?.detail || "Erro ao fazer upload !"
            addToast(mensagem, "erro")
        }
    }

    return (
        <div id="addmidia-container" onClick={handleOutsideClick}>

            {modalIAaberto && (
                <div id="addmidia-analiseIA">
                    <h2>Análise IA</h2>
                    {loadingIA ? (
                        <p>Analisando mídia...</p>
                    ) : analiseIA && (
                        <div className="addmidia-analiseIA-result">
                            <p>
                                <strong>Título sugerido: </strong>
                                {analiseIA.titulo}
                            </p>
                            <p>
                                <strong>Categoria: </strong>
                                {analiseIA.categoria}
                            </p>
                            <p>
                                <strong>Tempo sugerido: </strong>
                                {analiseIA.tempo_exibicao}s
                            </p>
                            <p>
                                <strong>Descrição: <br /> </strong>
                                {analiseIA.descricao}
                            </p>
                            <p>
                                <strong>Conteúdo seguro: </strong>
                                {analiseIA.conteudo_seguro
                                    ? "Sim"
                                    : "Não"}
                            </p>
                            {analiseIA.alerta && (
                                <p>
                                    <strong>Alerta: </strong>
                                    {analiseIA.alerta}
                                </p>
                            )}
                        </div>
                    )}
                </div>
                
            )}

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
                                    <span id="addmidia-span-upload">Escolha o arquivo <br /> Arquivos suportados: PNG, JPEG, MP4 <br /> Max: 100MB </span>
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
                                    id="send-analyse"
                                    className="second-action-button"
                                    type="button"
                                    onClick={handleAnalyseAI}
                                >
                                    {loadingIA ? (
                                        "Carregando..."
                                    ) : (
                                        <>
                                            <i className="bi bi-openai"></i>
                                            Analise IA
                                        </>
                                    )}
                                </button>

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
                                <legend className="addmidia-legend">{"Duração (Opcional)"}</legend>
                                <input
                                    id="addmidia-duracao"
                                    className="addmidia-input"
                                    type="text"
                                    placeholder="padrão 3 segundos"
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
                                    {tvs.map(tv => tv.ativo && (
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

                            <fieldset id="addmidia-field-exibicao" className="addmidia-field">
                                <legend className="addmidia-legend">{"Inicio da exibição (Opcional)"}</legend>
                                <input
                                    id="addmidia-exibicao"
                                    className="addmidia-input"
                                    type="datetime-local"
                                    placeholder="Data e hora de inicio"
                                    value={exibicao}
                                    onChange={(e) => setExibicao(e.target.value)}
                                />
                            </fieldset>

                            <fieldset id="addmidia-field-expiracao" className="addmidia-field">
                                <legend className="addmidia-legend">{"Expiração (Opcional)"}</legend>
                                <input
                                    id="addmidia-expiracao"
                                    className="addmidia-input"
                                    type="datetime-local"
                                    placeholder="Data e hora de fim"
                                    value={expiracao}
                                    onChange={(e) => setExpiracao(e.target.value)}
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
                        <div id="addmidia-resumo-container">
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
                                <p><strong>Duração:</strong> {duracao || "(padrão) 5"} segundos</p>
                                <p><strong>Inicio da exibição:</strong> {exibicao || "Imediato"}</p>
                                <p><strong>Fim da exibição:</strong> {expiracao || "Sem expiração"}</p>
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
                    
                        </div>
                    ) : (
                        <p>Erro ao carregar recurso</p>
                    )}
                </form>
            </div>
        </div>
    )
}