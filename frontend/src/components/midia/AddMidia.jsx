import "./AddMidia.css"

export const AddMidia = ({ onClose }) => {

    const handleOutsideClick = (e) => {
        if (e.target.id === "addmidia-container") {
            onClose()
        }
    }

    return (
        <div id="addmidia-container" onClick={handleOutsideClick}>
            <div id="addmidia-content">
                <h2>Nova Mídia</h2>

                <form id="addmidia-form">

                    
                    <fieldset className="addmidia-field">
                        <legend className="addmidia-legend">Nome</legend>
                        <input 
                            className="addmidia-input" 
                            type="text" 
                            placeholder="Nome" 
                        />
                    </fieldset>

                    <label htmlFor="addmidia-input-upload" id="addmidia-label-upload">
                        
                        <input 
                            id="addmidia-input-upload"
                            className="addmidia-input" 
                            type="file" 
                            placeholder="Upload" 
                        />

                        <span id="addmidia-span-upload">Escolha o arquivo <br /> Arquivos suportados: PNG, JPEG, MP4 </span>
                    </label>

                    {/* <fieldset className="addmidia-field">
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
                    </fieldset> */}

                    
                    <button className="action-button" type="submit">Adicionar</button>
                </form>
            </div>
        </div>
    )
}