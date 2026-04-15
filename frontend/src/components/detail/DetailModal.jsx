import "./DetailModal.css"
import { formatarDataHora } from "../../utils/formatters"

export const DetailModal = ({ tipo, onClose, item }) => {

    const handleOutsideClick = (e) => {
        if(e.target.id === "detail-container"){
            onClose()
        }
    }


    const lista = tipo === "midia" ? item.tvs : item.midias

    const titulo = tipo === "midia"
        ? `TVs associadas à mídia "${item.nome}"`
        : `Midias associadas à TV ${item.numero} - ${item.nome}` 

    return (
        <div id="detail-container" onClick={handleOutsideClick}>
            <div id="detail-content">

                <button 
                    className="close-button"
                    onClick={onClose}
                >
                    <i className="bi bi-x-circle"></i>
                </button>

                <h2 id="detail-titulo">{titulo}</h2>

                <div className="table-container">
                    {lista.length === 0 ? (
                        <p>Nenhum vínculo encontrado.</p>
                    ) : tipo === "midia" ? (
                        <table id="detail-midia-table">
                            <thead>
                                <tr>
                                    <th className="left-table">ID</th>
                                    <th>Número</th>
                                    <th className="right-table">Nome</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lista.map(tv => (
                                    <tr key={tv.id}>
                                        <td>{tv.id}</td>
                                        <td>{tv.numero}</td>
                                        <td>{tv.nome}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <table id="detail-tv-table">
                            <thead>
                                <tr>
                                    <th className="left-table">Nome</th>
                                    <th>Tipo</th>
                                    <th>Duração</th>
                                    <th>Inicio</th>
                                    <th className="right-table">Fim</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lista.map(midia => (
                                    <tr key={midia.id}>
                                        <td>{midia.nome}</td>
                                        <td>{midia.tipo}</td>
                                        <td>{midia.duracao_segundos}</td>
                                        <td>{formatarDataHora(midia.inicio_exibicao)}</td>
                                        <td>{formatarDataHora(midia.expiracao)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    )
}