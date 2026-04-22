import { useState } from "react"
import "./EditTv.css"
import { api } from "../../api/axios"

export const EditTv = ({ item, onClose, onSuccess }) => {


    const [ativo, setAtivo] = useState(item.ativo)
    const [nome, setNome] = useState(item.nome)
    const [numero, setNumero] = useState(item.numero)

    const handleOutsideClick = (e) => {
        if (e.target.id === "edittv-container") {
            onClose()
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const payload = {
            nome,
            numero,
            ativo
        }
        
        try{
            await api.patch(`/tv/${item.id}`, payload)
            onSuccess()
        }catch(error){
            const mensagem = error.response?.data?.detail || "Erro ao atualizar TV"
        }
    }

    return (
        <div id="edittv-container" onClick={handleOutsideClick}>
            <div id="edittv-content">

                 <button 
                    className="close-button"
                    onClick={onClose}
                >
                    <i className="bi bi-x-circle"></i>
                </button>

                <h2>Editar TV</h2>

                <p>ID: {item.id}</p>

                <form id="edittv-form-modal" className="addmidia-form" onSubmit={handleSubmit}>

                    <fieldset id="edittv-field-numero" className="addmidia-field">
                        <legend className="addmidia-legend">Numero da TV</legend>
                        <input
                            id="edittv-numero"
                            className="addmidia-input"
                            type="number"
                            step={1}
                            min={1}
                            placeholder="Ex: 1, 2, 3"
                            value={numero}
                            onChange={(e) => setNumero(e.target.value)}
                        />
                    </fieldset>

                    <fieldset id="edittv-field-nome" className="addmidia-field">
                        <legend className="addmidia-legend">Nome da TV</legend>
                        <input
                            id="edittv-nome"
                            className="addmidia-input"
                            type="text"
                            placeholder="Ex: TvHall, TvSetorNorte"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </fieldset>

                    <fieldset className="addmidia-field">
                        <legend className="addmidia-legend">Status</legend>
                        <label className="addmidia-tv-item">
                            <input
                                type="checkbox"
                                checked={ativo}
                                onChange={(e) => setAtivo(e.target.checked)}
                            />
                            Tv ativa
                        </label>
                    </fieldset>

                    <button
                        id="edittv-confirm"
                        className="action-button"
                        type="submit"
                        onClick={handleSubmit}
                    >Confirmar</button>
                </form>
            </div>
        </div>
    )
}