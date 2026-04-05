import { useEffect, useState } from "react"

import "./AddMidia.css"
import { Preview } from "./PreviewMidia"

export const AddMidia = ({ onClose }) => {

    const [togglePage, setTogglePage] = useState(1)

    // useEffect(() => {
    //     setTogglePage(togglePage)
    // }, [togglePage])

    const [nome, setNome] = useState("")
    const [data, setData] = useState("")
    const [duracao, setDuracao] = useState("")


    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState(null)
    const [status, setStatus] = useState("")
    const [uploadUrl, setUploadUrl] = useState(null)
    
    
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


    return (
        <div id="addmidia-container" onClick={handleOutsideClick}>
            <div id="addmidia-content">
                <h2>Nova Mídia</h2>

                {togglePage == 1 ? (
                    <form className="addmidia-form">

                    
                        <fieldset className="addmidia-field">
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

                        <fieldset className="addmidia-field">
                            <legend className="addmidia-legend">URL</legend>
                            <p id="addmidia-output-url">{preview}</p>
                        </fieldset>
                        
                        <div className="addmidia-buttons">
                            <button
                                id="addmidia-next"
                                className="action-button"
                                type="submit"
                                onClick={handleNextPage}
                            >Avançar</button>
                        </div>
                    </form>

                ) : togglePage == 2 ? (
                    <form className="addmidia-form">

                        <fieldset className="addmidia-field">
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

                        <fieldset className="addmidia-field">
                            <legend className="addmidia-legend">TV Associada</legend>
                            <input 
                                id="addmidia-tv"
                                className="addmidia-input" 
                                type="text" 
                                placeholder="ID da TV Associada" 
                            />
                        </fieldset>

                        <fieldset className="addmidia-field">
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
                                onClick={handleNextPage}
                            >Adicionar</button>
                        </div>
                    </form>

                ) : togglePage == 3 ? (<></>) : (<></>)}
            </div>
        </div>
    )
}