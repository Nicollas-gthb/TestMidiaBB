import { useState } from "react"

import "./AddTv.css"
import { api } from "../../api/axios"

export const AddTV = ({ onClose, onSuccess }) => {


    const [nome, setNome] = useState("")
    const [numero, setNumero] = useState("")

    const handleOutsideClick = (e) => {
        if (e.target.id === "addtv-container") {
            onClose()
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const payload = {
            numero: parseInt(numero),
            nome: nome
        }

        try{
            await api.post("/tv/", payload)
            onSuccess()
        }catch(error){
            console.error("Erro ao criar TV", error)
        }
    }

    return (
        <div id="addtv-container" onClick={handleOutsideClick}>
            <div id="addtv-content">

                 <button 
                    className="close-button"
                    onClick={onClose}
                >
                    <i className="bi bi-x-circle"></i>
                </button>

                <h2>Nova TV</h2>

                <form id="addtv-form-modal" className="addmidia-form" onSubmit={handleSubmit}>

                    <fieldset id="addtv-field-numero" className="addmidia-field">
                        <legend className="addmidia-legend">Numero da TV</legend>
                        <input
                            id="addtv-numero"
                            className="addmidia-input"
                            type="number"
                            step={1}
                            min={1}
                            placeholder="Ex: 1, 2, 3"
                            value={numero}
                            onChange={(e) => setNumero(e.target.value)}
                        />
                    </fieldset>

                    <fieldset id="addtv-field-nome" className="addmidia-field">
                        <legend className="addmidia-legend">Nome da TV</legend>
                        <input
                            id="addtv-nome"
                            className="addmidia-input"
                            type="text"
                            placeholder="Ex: TvHall, TvSetorNorte"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </fieldset>

                    <button
                        id="addtv-confirm"
                        className="action-button"
                        type="submit"
                        onClick={handleSubmit}
                    >Confirmar</button>
                </form>
            </div>
        </div>
    )
}