import "./Toast.css"

const config = {
    sucesso: {icone: "bi-check-circle-fill", label: "Sucesso"},
    erro: {icone: "bi-x-circle-fill", label: "Erro"},
    aviso: {icone: "bi-exclamation-triangle-fill", label: "Aviso"},
    info: {icone: "bi-info-circle-fill", label: "Info"}
}

export const Toast = ({ id, mensagem, tipo, onRemove }) => {
    const { icone, label } = config[tipo] || config.info

    return (
        <div className={`toast toast-${tipo}`} >
            <i className={`bi ${icone}`}></i>

            <div className="toast-body">
                <span className="toast-label">{label}</span>
                <span className="toast-mensagem">{mensagem}</span>
            </div>

            <button className="toast-close" onClick={() => onRemove(id)}></button>
        </div>
    )
}

export const ToastContainer = ({ toasts, onRemove }) => {
    return (
        <div id="toast-container">
            {toasts.map(t => (
                <Toast key={t.id} {...t} onRemove={onRemove}/>
            ))}
        </div>
    )
}