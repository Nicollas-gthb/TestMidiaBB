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

    const [historico, setHistorico] = useState([])
    
    useEffect(() => {
        carregarTvs()
    }, [])

    useEffect(() => {
        carregarMidias()
    }, [])

    useEffect(() => {
        carregarHistorico()
    }, [])

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

    
    const calcularStatus = (midia) => {
        if(!midia.ativo) return "removida"

        const agora = new Date()

        if(midia.inicio_exibicao && new Date(midia.inicio_exibicao) > agora) return "agendada"

        if(midia.expiracao && new Date(midia.expiracao) < agora) return "expirada"

        return "ativa"
    }

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

    const carregarHistorico = async () => {
        try{
            const response = await api.get("/historico/")
            setHistorico(response.data)
            addToast("Histórico carregado !", "sucesso")
        }catch(error){
            const mensagem = error?.response?.data?.detail || "Erro ao carregar histórico"
            addToast(mensagem, "erro")
        }
    }
    
        
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
                        <div id="card-midia-expirando" className="home-cards">
                            <div className="home-card-head">
                                <i className="bi card-bi bi-clock"></i>
                                Histórico Recente
                            </div>

                            <div className="home-card-body">
                                {historico.length === 0 ? (
                                    <div className="home-card-vazio">
                                        <p>Sem Histórico</p>
                                    </div>
                                ) : (
                                    <>
                                        <table>
                                            <tbody>
                                                {historico.map(h => (
                                                    <tr key={h.id}>
                                                        <td>
                                                            <span className="historico-icon"></span>
                                                            <span className="historico-text">

                                                                <p className="historico-main-text">{`${h.entidade} "${h.entidade_nome}" foi ${h.acao}`}</p>
                                                                <p className="historico-sub-text">{`${h.usuario_nome}`}</p>
                            
                                                            </span>
                                                        </td>
                                                        <td>{formatarDataHora(h.criado_em)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </>
                                )}
                            </div>

                            <div className="home-card-foot">
                                Ver Todas
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}