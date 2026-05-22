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

    const COLORS = [
        "#3b82f6",
        "#22c55e",
        "#f5740b",
        "#656970"
    ]

    const { addToast } = useToast()
    
    const [historico, setHistorico] = useState([])

    const [mediaTypes, setMediaTypes] = useState([])
    const [totalMidias, setTotalMidias] = useState(0)
    //const [tvStats, setTvStats] = useState([])

    useEffect(() => {
        api.get("/dashboard/media-types")
            .then(res => {
                setMediaTypes(res.data.data)
                setTotalMidias(res.data.total)
            })
    }, [])

    // useEffect(() => {
    //     api.get("/dashboard/tv-midias")
    //         .then(res => {

    //             console.log(res.data)

    //             setTvStats(res.data)
    //         })

    // }, [])

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

                <div id="reports-menu-main">
                    <h2>Relatórios</h2>

                    <div className="reports-cards-container"></div>

                    <div className="reports-cards-container">

                        <div className="reports-cards-graficos">

                            
                            <div className="reports-cards">
                                <div className="reports-chart-container">
                                    
                                </div>
                            </div>

                            <div className="reports-cards">
                                <div id="donut-container" className="reports-chart-container">

                                    <ResponsiveContainer width={"100%"} height={"100%"}>
                                        <PieChart>
                                            <Pie
                                                data={mediaTypes}
                                                dataKey={"value"}
                                                nameKey={"name"}
                                                innerRadius={90}
                                                outerRadius={130}
                                                paddingAngle={4}
                                            >
                                                {mediaTypes.map((entry, index) => (
                                                    <Cell 
                                                        key={index}
                                                        fill={COLORS[index % COLORS.length]}
                                                    />
                                                ))}
                                            </Pie>
                                        </PieChart>

                                        <Tooltip />

                                    </ResponsiveContainer>

                                    <div className="donut-center">
                                        <h1>{totalMidias}</h1>
                                        <p>mídias</p>
                                    </div>

                                    

                                </div>

                                <div id="donut-legend">
                                    {mediaTypes.map((entry, index) => (
                                        <div key={index} className="donut-legend-item">
                                            <section className="donut-legend-color" style={{ backgroundColor: COLORS[index % COLORS.length ] }}></section>    
                                            <p className="donut-legend-text">{entry.name} : {entry.value}</p>
                                        </div>
                                    ))}
                                </div>

                            </div>
           
                        </div>

                        
                        <div id="card-reports-historico" className="reports-cards">
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
                                   
                                )}
                            </div>
                        </div>
                        
                    </div>
                </div>
            </main>
        </div>
    )
}