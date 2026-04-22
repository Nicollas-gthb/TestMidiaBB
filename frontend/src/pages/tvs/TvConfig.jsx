import { useState, useEffect} from "react"

import "./TvConfig.css"
import { Aside } from "../../components/aside/Aside"
import { Header } from "../../components/header/Header"
import { api } from "../../api/axios"
import { AddTV } from "../../components/tv/AddTv"
import { DetailModal } from "../../components/detail/DetailModal"
import { EditTv } from "../../components/tv/EditTv"

export default function TvConfig() {

    const [addTvAberto, setAddTvAberto] = useState(false)
    const [detail, setDetail] = useState(null)
    const [edit, setEdit] = useState(null)

    const [tvs, setTvs] = useState([])

    const carregarTvs = async () => {
        try{
            const response = await api.get("/tv/")
            setTvs(response.data)
        }catch(error){
            console.error("Erro ao carregar as tvs", error)
        }
    }

    useEffect(() => {
        carregarTvs()
    }, [])

    const handleDeletar = async (id) => {
        try{
            await api.delete(`/tv/${id}`)
            carregarTvs()
        }catch(error){
            console.error("Erro ao deletar tv", error)
        }
    }

    return (
        <div id="midia-container">

            <Aside />

            <main id="midia-main-container">

                <Header />

                <div id="midia-menu-main">

                    <div className="table-title">

                        <h2>Gestão de TVs</h2>
        
                        <button 
                            className="action-button"
                            onClick={() => {
                                setAddTvAberto(true)
                            }}
                        >
                            <i className="bi bi-arrow-bar-up"></i>
                            Nova TV
                        </button>

                    </div>

                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th className="left-table">ID</th>
                                    <th>NOME</th>
                                    <th>NUMERO</th>
                                    <th>MIDIAS</th>
                                    <th>STATUS</th>
                                    <th>URL</th>
                                    <th className="right-table">AÇÕES</th>
                                </tr>
                            </thead>
                            <tbody>

                                {tvs.map(tv => (
                                    <tr key={tv.id}>
                                        <td>{tv.id}</td>
                                        <td>{tv.nome}</td>
                                        <td>{tv.numero}</td>
                                        <td>
                                            <button 
                                                id="tv-detail-button" 
                                                className="action-button"
                                                onClick={() => {setDetail(tv)}}
                                            >
                                                <i className="bi bi-eye"></i>
                                                Ver mais
                                            </button>
                                        </td>
                                        <td>
                                            <div className={tv.ativo ? "status-ativa" : "status-removida"}>
                                                {tv.ativo ? "ativa" : "inativa"}
                                            </div>
                                        </td>
                                        <td>
                                            <a href={`/tv/${tv.numero}`} target="_blank" rel="noreferrer">
                                                Transmissão
                                            </a>
                                        </td>
                                        <td>
                                            <button
                                                className="second-action-button"
                                                onClick={() => setEdit(tv)}
                                            >
                                                <i className="bi bi-pencil-square"></i>
                                            </button>
                                            <button
                                                className="second-action-button"
                                                onClick={() => handleDeletar(tv.id)}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {tvs.length === 0 && (
                                    <tr>
                                        <td colSpan={9} style={{ textAlign: "center" }}>
                                            Nenhuma tv cadastrada
                                        </td>
                                    </tr>
                                )}
                                
                            </tbody>
                        </table>
                    </div>

                    {addTvAberto && (
                        <AddTV 
                            onClose={() => setAddTvAberto(false)}
                            onSuccess={() => {
                                setAddTvAberto(false)
                                carregarTvs()
                            }}
                        />
                    )}

                    {detail && (
                        <DetailModal 
                            onClose={() => {setDetail(null)}}
                            tipo={"tv"}
                            item={detail}
                        />
                    )}

                    {edit !== null && (
                        <EditTv 
                            item={edit}
                            onClose={() => {setEdit(null)}}
                            onSuccess={() => {
                                setEdit(null)
                                carregarTvs()
                            }}
                        />
                    )}
                </div>
            </main>
        </div>
    )
}