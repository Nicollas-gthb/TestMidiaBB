import { useEffect, useState } from "react"

import "./Midia.css"
import { AddMidia } from "../../components/midia/AddMidia"
import { api } from "../../api/axios"
import { Aside } from "../../components/aside/Aside"
import { Header } from "../../components/header/Header"
import { DetailModal } from "../../components/detail/DetailModal"
import { formatarDataHora } from "../../utils/formatters"

export default function Midia() {

    const [addMidiaAberto, setAddMidiaAberto] = useState(false)

    const [detail, setDetail] = useState(null)

    const [midias, setMidias] = useState([])

    const carregarMidias = async () => {
        try{
            const response = await api.get("/midias/")
            setMidias(response.data)
        }catch(error){
            console.error("Erro ao carregar mídias", error)
        }
    }

    useEffect(() => {
        carregarMidias()
    }, [])

    const handleDeletar = async (id) => {
        try{
            await api.delete(`/midias/${id}`)
            carregarMidias()
        }catch(error){
            console.error("Erro ao deletar mídia", error)
        }
    }

    return (
        <div id="midia-container">

            <Aside />

            <main id="midia-main-container">

                <Header />

                <div id="midia-menu-main">

                    <div className="table-title">

                        <h2>Gestão de midias</h2>
        
                        <button 
                            className="action-button"
                            onClick={() => {setAddMidiaAberto(true)}}
                        >
                            <i className="bi bi-arrow-bar-up"></i>
                            Nova midia
                        </button>

                    </div>

                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th className="left-table">ID</th>
                                    <th>NOME</th>
                                    <th>TIPO</th>
                                    <th>TVS</th>
                                    <th>STATUS</th>
                                    <th>INICIO</th>
                                    <th>FIM</th>
                                    <th>DURAÇÃO</th>
                                    <th>URL</th>
                                    <th className="right-table">AÇÕES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {midias.map(midia => (
                                    <tr key={midia.id}>
                                        <td>{midia.id}</td>
                                        <td>{midia.nome}</td>
                                        <td>{midia.tipo}</td>
                                        <td>
                                            <button 
                                                id="midia-detail-button" 
                                                className="action-button"
                                                onClick={() => {setDetail(midia)}}
                                            >
                                                <i className="bi bi-eye"></i>
                                                Ver mais
                                            </button>
                                        </td>
                                        <td>
                                            <div className={midia.ativo ? "status-ativa" : "status-inativa"}>
                                                {midia.ativo ? "Ativa" : "Inativa"}
                                            </div>
                                        </td>
                                        <td>{formatarDataHora(midia.inicio_exibicao)}</td>
                                        <td>{formatarDataHora(midia.expiracao)}</td>
                                        <td>{midia.duracao_segundos}s</td>
                                        <td>
                                            <a href={midia.arquivo} target="_blank" rel="noreferrer">
                                                Ver arquivo
                                            </a>
                                        </td>
                                        <td>
                                            <button
                                                className="second-action-button"
                                                onClick={() => handleDeletar(midia.id)}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {midias.length === 0 && (
                                    <tr>
                                        <td colSpan={15} style={{ textAlign: "center" }}>
                                            Nenhuma mídia cadastrada
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {addMidiaAberto && (
                        <AddMidia 
                            onClose={() => setAddMidiaAberto(false)}
                            onSuccess={() => {
                                setAddMidiaAberto(false)
                                carregarMidias()
                            }}
                        />
                    )}

                    {detail && (
                        <DetailModal 
                            onClose={() => {setDetail(null)}}
                            tipo={"midia"}
                            item={detail}
                        />
                    )}
                </div>
            </main>
        </div>
    )
}