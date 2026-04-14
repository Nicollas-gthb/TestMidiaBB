import "./DetailModal.css"

export const DetailModal = ({ tipo, onClose, item }) => {

    const handleOutsideClick = (e) => {
        if(e.target.value === "detail-container"){
            onClose()
        }
    }

    return (
        <div id="detail-container" onClick={handleOutsideClick}>
            <div id="detail-content">

                <button 
                    className="close-button"
                    onClick={onClose}
                >
                    <i className="bi bi-x-circle"></i>
                </button>

                <h2>Detalhes de {tipo}</h2>
            </div>
        </div>
    )
}