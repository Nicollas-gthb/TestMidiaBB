import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

import "./Home.css"
import { Aside } from "../../components/aside/Aside"
import { Header } from "../../components/header/Header"
import { useToast } from "../../contexts/ToastContext"
import { api } from "../../api/axios"
import { formatarDataHora } from "../../utils/formatters"

export default function Home() {

    const navigate = useNavigate()

    const [tvs, setTvs] = useState([])
    const [midias, setMidias] = useState([])
    const { addToast } = useToast()    

    const [listaHistorico, setListaHistorico] = useState([])
    const [pagina, setPagina] = useState(1)
    const [totalPaginas, setTotalPaginas] = useState(1)
    const [filtroUsuario, setFiltroUsuario] = useState("")
    const [filtroAcao, setFiltroAcao] = useState("")
    const [dataInicio, setDataInicio] = useState("")
    const [dataFim, setDataFim] = useState("")

    const buscarHistorico = async () => {
        try{

            const payload = {
                pagina: pagina,
                limite: 20,
                usuario: filtroUsuario || undefined,
                acao: filtroAcao || undefined,
                data_inicio: dataInicio || undefined,
                data_fim: dataFim || undefined
            }

            const response = await api.get("/historico/list", {params: payload})

            setListaHistorico(response.data.dados)

            console.log(response.data.dados)
            console.log(response.data)

            setTotalPaginas(response.data.total_paginas)


        }catch(error){
            const mensagem = error.response?.data.detail || "Erro ao carregar histórico !"
            addToast(mensagem, "erro")
        }
    }

    useEffect(() => {
        buscarHistorico()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagina, filtroUsuario, filtroAcao, dataInicio, dataFim])

    const calcularStatus = (midia) => {
        if(!midia.ativo) return "removida"

        const agora = new Date()

        if(midia.inicio_exibicao && new Date(midia.inicio_exibicao) > agora) return "agendada"

        if(midia.expiracao && new Date(midia.expiracao) < agora) return "expirada"

        return "ativa"
    }

    
    useEffect(() => {
        const carregarTvs = async () => {
            try{
                const response = await api.get("/tv/")
                setTvs(response.data)
                addToast("TVs carregadas !", "sucesso")
            }catch(error){
                const mensagem = error.response?.data.detail || "Erro ao carregar as tvs !"
                addToast(mensagem, "erro")
            }
        }
        carregarTvs()
    }, [addToast])


    useEffect(() => {
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
        carregarMidias()
    }, [addToast])


    // useEffect(() => {
    //     const carregarHistorico = async () => {
    //         try{
    //             const response = await api.get("/historico/")
    //             setHistorico(response.data)
    //             addToast("Histórico carregado !", "sucesso")
    //         }catch(error){
    //             const mensagem = error?.response?.data?.detail || "Erro ao carregar histórico"
    //             addToast(mensagem, "erro")
    //         }
    //     }
    //     carregarHistorico()
    // }, [addToast])
        
    const totalTvsAtivas = tvs.filter(tv => tv.ativo).length
    const totalMidiasAtivas = midias.filter(m => calcularStatus(m) === "ativa").length
    const totalMidiasAgendadas = midias.filter(m => calcularStatus(m) === "agendada").length
    const totalMidiasExpiradas = midias.filter(m => calcularStatus(m) === "expirada").length

    const listaMidiasAgendadas = midias.filter(
        m => calcularStatus(m) === "agendada"
    ).sort(
        (a, b) => new Date(a.inicio_exibicao) - new Date(b.inicio_exibicao)
    ).slice(0, 3)

    const listaMidiasExpirando = midias.filter(m => {
        if(!m.expiracao) return false
        const diff = new Date(m.expiracao) - new Date()
        return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000 // expira nos próximos 7 dias
    }).sort(
        (a, b) => new Date(a.expiracao) - new Date(b.expiracao)
    ).slice(0, 3)

    // const listaHistorico = historico.sort(
    //     (a, b) => new Date(b.criado_em) - new Date(a.criado_em)
    // ).slice(0, 5)

    return (
        <div id="home-container">

            <Aside />

            <main id="home-main-container">

                <Header />

                <div id="home-menu-main">
                    <h2>Home</h2>

                    <div className="home-cards-container">
                        <div className="home-cards">
                            <div className="home-card-head">

                                <i className="bi card-bi bi-cast"></i>
                                <p className="home-card-title">
                                    Tvs Ativas
                                </p>


                            </div>
                            <p className="home-card-numbers">{totalTvsAtivas}</p>
                            <p className="home-card-info">{`de ${tvs.length} cadastrdas`}</p>
                        </div>

                        <div className="home-cards">
                            <div className="home-card-head">

                                <i className="bi card-bi bi-images"></i>
                                <p className="home-card-title">
                                    Midias Ativas
                                </p>


                            </div>
                            <p className="home-card-numbers">{totalMidiasAtivas}</p>
                            <p className="home-card-info">{`de ${midias.length} cadastrdas`}</p>
                        </div>

                        <div className="home-cards">
                            <div className="home-card-head">

                                <i className="bi card-bi bi-calendar-event"></i>
                                <p className="home-card-title">
                                    Midias Agendadas
                                </p>

                            </div>
                            <p className="home-card-numbers">{totalMidiasAgendadas}</p>
                            <p className="home-card-info">{`de ${midias.length} cadastrdas`}</p>
                        </div>

                        <div className="home-card-head" className="home-cards">
                            <div className="home-card-head">

                                <i className="bi card-bi bi-clock"></i>
                                <p className="home-card-title">
                                    Midias Expiradas
                                </p>

                            </div>
                            <p className="home-card-numbers">{totalMidiasExpiradas}</p>
                            <p className="home-card-info">{`de ${midias.length} cadastrdas`}</p>
                        </div>
                    </div>

                    <div className="home-cards-container">
                        
                        <div id="card-midia-agendada" className="home-cards">
                            
                            <div className="home-card-head">
                                <i className="bi card-bi bi-calendar-event"></i>
                                Últimas Mídias Agendadas
                            </div>

                            <div className="home-card-body">
                                {listaMidiasAgendadas.length === 0 ? (
                                    <div className="home-card-vazio">
                                        <p>Sem Conteúdo Agendado</p>
                                    </div>
                                ) : (
                                    <>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td>ID</td>
                                                    <td>Nome</td>
                                                    <td>Tipo</td>
                                                    <td>Tvs</td>
                                                    <td>Inicio</td>
                                                </tr>
                                                {listaMidiasAgendadas.map(m => (
                                                    <tr key={m.id}>
                                                        <td>{m.id}</td>
                                                        <td>{m.nome}</td>
                                                        <td>{m.tipo}</td>
                                                        <td>{m.tvs.length}</td>
                                                        <td>{formatarDataHora(m.inicio_exibicao)}</td>
                                                        
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </>
                                )}
                            </div>

                            <div 
                                className="home-card-foot"
                                onClick={() => navigate("/midia")}
                            >
                                Ver Todas
                            </div>
                        </div>

                        <div id="card-midia-expirando" className="home-cards">
                            <div className="home-card-head">
                                <i className="bi card-bi bi-clock"></i>
                                Midias Expirando em Breve
                            </div>

                            <div className="home-card-body">
                                {listaMidiasExpirando.length === 0 ? (
                                    <div className="home-card-vazio">
                                        <p>Sem Conteúdo Expirando</p>
                                    </div>
                                ) : (
                                    <>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td>ID</td>
                                                    <td>Nome</td>
                                                    <td>Tipo</td>
                                                    <td>Tvs</td>
                                                    <td>Expira em</td>
                                                </tr>
                                                {listaMidiasExpirando.map(m => (
                                                    <tr key={m.id}>
                                                        <td>{m.id}</td>
                                                        <td>{m.nome}</td>
                                                        <td>{m.tipo}</td>
                                                        <td>{m.tvs.length}</td>
                                                        <td>{formatarDataHora(m.expiracao)}</td>
                                                        
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>  
                                    </>
                                )}
                            </div>

                            <div 
                                className="home-card-foot"
                                onClick={() => navigate("/midia")}
                            >
                                Ver Todas
                            </div>
                        </div>

                    </div>

                    <div className="home-cards-container">
                        <div id="card-midia-historico" className="home-cards">

                                <p>Histórico de Ações</p>
                                <small>Veja as ações realizadas por você no sistema</small>

                                <section className="profile-historico-controllers">
                                    <input
                                        type="text"
                                        placeholder="Nome do usuário"
                                        value={filtroUsuario}
                                        onChange={(e) =>setFiltroUsuario(e.target.value)}
                                    />

                                    <select
                                        value={filtroAcao}
                                        onChange={(e) => setFiltroAcao(e.target.value)}
                                    >
                                        <option value="">Todas as ações</option>
                                        <option value="adicionada">Adicionada</option>
                                        <option value="editada">Editada</option>
                                        <option value="editado">Editado</option>
                                        <option value="deletada">Deletada</option>
                                        <option value="removida">Removida</option>
                                    </select>

                                    <input
                                        type="date"
                                        value={dataInicio}
                                        onChange={(e) => setDataInicio(e.target.value)}
                                    />

                                    <input
                                        type="date"
                                        value={dataFim}
                                        onChange={(e) => setDataFim(e.target.value)}
                                    />

                                    <button
                                        onClick={() => {
                                            setPagina(1)
                                        }}
                                    >
                                        <i className="bi bi-funnel"></i>
                                        Filtrar
                                    </button>
                                </section>

                                <div className="profile-historico-table">
                                    {listaHistorico.length === 0 ? (
                                        <div className="home-card-vazio">
                                            <p>Sem Histórico</p>
                                        </div>
                                    ) : (
                                        <table>
                                            
                                            <tbody>
                                                {listaHistorico.map(h => (
                                                    <tr key={h.id}>
                                                        <td id="historico-content">
                                                            <span className={`historico-icon home-tag-${h.acao.replace(" ", "-")}`}/>

                                                            <span className="historico-text">
                                                                <p className="historico-main-text">{`${h.entidade} "${h.entidade_nome}" foi ${h.acao}`}</p>

                                                                <p className="historico-sub-text">{h.usuario_nome}</p>
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className="historico-data">{formatarDataHora(h.criado_em)}</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>


                                <section className="profile-historico-controllers">
                                    <button
                                        disabled={pagina === 1}
                                        onClick={() => setPagina(pagina - 1)}
                                    >
                                        <i className="bi bi-chevron-left"></i>
                                    </button>

                                    <span>Página {pagina} de {totalPaginas}</span>

                                    <button
                                        disabled={pagina === totalPaginas}
                                        onClick={() => setPagina(pagina + 1)}
                                    >
                                        <i className="bi bi-chevron-right"></i>
                                    </button>
                                </section>
                            

                            <div 
                                className="home-card-foot"
                                onClick={() => navigate("/reports")}
                            >
                                Ver Todas
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}