import { useEffect, useState } from "react"

import "./Midia.css"
import { AddMidia } from "../../components/midia/AddMidia"
import { api } from "../../api/axios"
import { Aside } from "../../components/aside/Aside"
import { Header } from "../../components/header/Header"
import { DetailModal } from "../../components/detail/DetailModal"
import { formatarDataHora } from "../../utils/formatters"
import { EditMidia } from "../../components/midia/EditMidia"
import { useToast } from "../../contexts/ToastContext"

export default function Midia() {

    const { addToast } = useToast()

    const [addMidiaAberto, setAddMidiaAberto] = useState(false)
    const [edit, setEdit] = useState(null)
    const [detail, setDetail] = useState(null)
    const [midias, setMidias] = useState([])
    const [busca, setBusca] = useState("")
    const [filtroStatus, setFiltroStatus] = useState("todos")

    

    const calcularStatus = (midia) => {
        if(!midia.ativo) return "removida"

        const agora = new Date()

        if(midia.inicio_exibicao && new Date(midia.inicio_exibicao) > agora) return "agendada"

        if(midia.expiracao && new Date(midia.expiracao) < agora) return "expirada"

        return "ativa"
    }

    const midiasFiltradas = midias
        .filter(m => m.nome.toLowerCase().includes(busca.toLowerCase()))
        .filter(m => filtroStatus === "todos" ? true : calcularStatus(m) === filtroStatus)

    const carregarMidias = async () => {
        try{
            const response = await api.get("/midias/")
            setMidias(response.data)
            addToast("Mídias carregadas !", "sucesso")
        }catch(error){
            const mensagem = error.response?.data?.detail || "Erro ao carregar mídias !"
            addToast(mensagem, "erro")
        }
    }

    useEffect(() => {
        carregarMidias()
    }, [])

    const handleDeletar = async (id) => {

        // if (!window.confirm("Tem certeza? Esse é um hard delete, a ação não pode ser desfeita.")) return

        try{
            await api.delete(`/midias/${id}`)
            addToast("Mídias removidas !", "aviso")
            carregarMidias()
        }catch(error){
            const mensagem = error.response?.data?.detail || "Erro ao deletar mídias !"
            addToast(mensagem, "erro")
        }
    }

    return (
        <div id="midia-container">

            <Aside />

            <main id="midia-main-container">

                <Header />

                <div id="midia-menu-main">

                    <h2>Gestão de mídias</h2>
                    
                    <div className="table-title">
                    </div>

                    <div className="table-filters">

                        <button 
                            className="action-button"
                            onClick={() => {setAddMidiaAberto(true)}}
                        >
                            <i className="bi bi-arrow-bar-up"></i>
                            Nova mídia
                        </button>

                        <input
                            id="search-midias"
                            className="filter-search"
                            type="text"
                            placeholder="Buscar por nome..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                        />
                        <select
                            id="select-midia"
                            className="filter-select"
                            value={filtroStatus}
                            onChange={(e) => setFiltroStatus(e.target.value)}
                        >
                            <option value="todos">Todos</option>
                            <option value="ativa">Ativas</option>
                            <option value="agendada">Agendadas</option>
                            <option value="expirada">Expiradas</option>
                            <option value="removida">Removidas</option>
                        </select>
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
                                {midiasFiltradas.map(midia => (
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
                                            <div className={`status status-${calcularStatus(midia)}`}>
                                                {calcularStatus(midia)}
                                            </div>
                                        </td>
                                        <td>{formatarDataHora(midia.inicio_exibicao)}</td>
                                        <td>{formatarDataHora(midia.expiracao)}</td>
                                        <td>{midia.duracao_segundos}s</td>
                                        <td>
                                            <a 
                                                href={midia.arquivo} 
                                                className="table-link" 
                                                target="_blank" 
                                                rel="noreferrer">
                                                Ver arquivo
                                            </a>
                                        </td>
                                        <td>
                                            <button
                                                className="second-action-button"
                                                onClick={() => setEdit(midia)}
                                            >
                                                <i className="bi bi-pencil-square"></i>
                                            </button>
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

                    {edit !== null && (
                        <EditMidia
                            item={edit}
                            onClose={() => {setEdit(null)}}
                            onSuccess={() => {
                                setEdit(null)
                                carregarMidias()
                            }} 
                        />
                    )}
                </div>
            </main>
        </div>
    )
}