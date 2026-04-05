import { useState } from "react"

import "./AddMidia.css"
import { Preview } from "./PreviewMidia"

export const AddMidia = ({ onClose }) => {

    const [toggle, setToggle] = useState(false)

    const [nome, setNome] = useState("")

    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState(null)
    const [status, setStatus] = useState("")
    const [uploadUrl, setUploadUrl] = useState(null)
    
    
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        if(!selectedFile) return

        setFile(selectedFile)

        const previrewUrl = URL.createObjectURL(selectedFile)
        setPreview(previrewUrl)
    }

    const handleRemoveFile = () => {
        setFile(null)
        setPreview(null)
    }

    const handleOutsideClick = (e) => {
        if (e.target.id === "addmidia-container") {
            onClose()
        }
    }

    return (
        <div id="addmidia-container" onClick={handleOutsideClick}>
            <div id="addmidia-content">
                <h2>Nova Mídia</h2>

                {toggle ? (
                    <form className="addmidia-form">
                        <fieldset className="addmidia-field">
                            <legend className="addmidia-legend">TVs Associadas</legend>
                            <input 
                                className="addmidia-input" 
                                type="text" 
                                placeholder="TVs Associadas" 
                            />
                        </fieldset>

                        <fieldset className="addmidia-field">
                            <legend className="addmidia-legend">Validade</legend>
                            <input 
                                className="addmidia-input" 
                                type="date" 
                                placeholder="Validade" 
                            />
                        </fieldset>

                        <fieldset className="addmidia-field">
                            <legend className="addmidia-legend">URL</legend>
                            <input 
                                className="addmidia-input" 
                                type="text" 
                                placeholder="URL" 
                            />
                        </fieldset>


                        <button 
                            className="second-action-button"
                            type="button" 
                            onClick={() => {setToggle(false)}}
                        >Voltar</button>

                        <button 
                            className="action-button" 
                            type="submit"
                            onClick={() => {}}
                        >Adicionar</button>
                    </form>
                ) : (
                    <form className="addmidia-form">

                    
                    <fieldset className="addmidia-field">
                        <legend className="addmidia-legend">Nome</legend>
                        <input 
                            className="addmidia-input" 
                            type="text" 
                            placeholder="Nome" 
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
                    
                    <button 
                        className="action-button" 
                        type="submit"
                        onClick={() => {setToggle(true)}}
                    >Avançar</button>
                </form>
                )}

                
            </div>
        </div>
    )
}