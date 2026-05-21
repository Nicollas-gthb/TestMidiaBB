import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid} from "recharts"

import { useState, useEffect } from "react"

import "./Reports.css"
import { api } from "../../api/axios"
import { useToast } from "../../contexts/ToastContext"
import { formatarDataHora } from "../../utils/formatters"
import { Aside } from "../../components/aside/Aside"
import { Header } from "../../components/header/Header"

export default function Reports(){

    const { addToast } = useToast()
    
    const [historico, setHistorico] = useState([])

    const [mediaTypes, setMediaTypes] = useState([])
    const [tvStats, setTvStats] = useState([])

    useEffect(() => {
        api.get("/dashboard/media-types")
            .then(res => {
                setMediaTypes(res.data)
            })

    }, [])

    useEffect(() => {
        api.get("/dashboard/tv-midias")
            .then(res => {

                console.log(res.data)

                setTvStats(res.data)
            })

    }, [])

    useEffect(() => {
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
        carregarHistorico()
    }, [addToast])

    return (
        <div id="home-container">

            <Aside />

            <main id="home-main-container">

                <Header />

                <div id="home-menu-main">
                    <h2>Relatórios</h2>

                    <div className="home-cards-container">
                        <div className="home-cards">

                            <div className="reports-chart-container">
                                <ResponsiveContainer width="100%" height="100%">

                                    <BarChart data={tvStats}>

                                        <CartesianGrid strokeDasharray="3 3" />

                                        <XAxis dataKey="tv" />

                                        <YAxis />

                                        <Tooltip />

                                        <Bar
                                            dataKey="midias"
                                            radius={[10, 10, 0, 0]}
                                        />

                                    </BarChart>

                                </ResponsiveContainer>

                            </div>
                            
                            <div style={{ width: "100%", height: 800 }}>

                                <ResponsiveContainer>

                                    <PieChart>

                                        <Pie
                                            data={mediaTypes}
                                            dataKey="value"
                                            nameKey="name"
                                            outerRadius={120}
                                        >

                                            <Cell fill="#3b82f6" />
                                            <Cell fill="#22c55e" />
                                            <Cell fill="#f59e0b" />

                                        </Pie>

                                        <Tooltip />

                                    </PieChart>

                                </ResponsiveContainer>

                            </div>
                        </div>
                        <div id="card-midia-historico" className="home-cards">
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
                                        
                                                        <td id="historico-content">
                                                            <span className={`historico-icon home-tag-${h.acao.replace(" ", "-")}`}>
                                                                
                                                            </span>
                                                            <span className="historico-text">

                                                                <p className="historico-main-text">{`${h.entidade} "${h.entidade_nome}" foi ${h.acao}`}</p>
                                                                <p className="historico-sub-text">{`${h.usuario_nome}`}</p>
                            
                                                            </span>
                                                        </td>
                                                
                                                        <td >
                                                            <span className="historico-data">
                                                                {formatarDataHora(h.criado_em)}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </>
                                )}
                            </div>

                            
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}