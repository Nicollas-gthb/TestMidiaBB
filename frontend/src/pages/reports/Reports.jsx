import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts" // grafico de pizza
import { BarChart, Bar, XAxis, YAxis, CartesianGrid} from "recharts" // grafico de barras

import { useState, useEffect, useContext } from "react"

import "./Reports.css"
import { api } from "../../api/axios"
import { useToast } from "../../contexts/ToastContext"
import { formatarDataHora } from "../../utils/formatters"
import { Aside } from "../../components/aside/Aside"
import { Header } from "../../components/header/Header"
import { ThemeContext } from "../../contexts/ThemeContext"

export default function Reports(){

    const COLORS = [
        "#3b82f6",
        "#22c55e",
        "#f5740b",
        "#656970"
    ]

    const { theme } = useContext(ThemeContext)
    const axisTextColor = theme === "light" ? "#000000" : "#dfdfdf"

    const { addToast } = useToast()

    const [mediaTypes, setMediaTypes] = useState([])
    const [totalMidias, setTotalMidias] = useState(0)
    const [tvStats, setTvStats] = useState([])
    const [mediaStatus, setMediaStatus] = useState([])

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

    useEffect(() => {
        api.get("/dashboard/media-types")
            .then(res => {
                setMediaTypes(res.data.data)
                setTotalMidias(res.data.total)
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
        api.get("/dashboard/media-status")
            .then(res => {
                console.log(res.data)
                setMediaStatus(res.data)
            })
    }, [])

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

    return (
        <div id="home-container">

            <Aside />

            <main id="home-main-container">

                <Header />

                <div id="reports-menu-main">
                    <h2>Relatórios</h2>

                    <div className="reports-cards-container">

                        <div id="axis-container" className="reports-cards">
                            <h2>Mídias por TV</h2>

                                <ResponsiveContainer width={"100%"} height={400}>

                                    <BarChart data={tvStats}>

                                        <CartesianGrid strokeDasharray="3 3" />

                                        <XAxis
                                            dataKey="tv"
                                            tick={{ fill: axisTextColor }}
                                        />

                                        <YAxis
                                            tick={{ fill: axisTextColor }}
                                        />

                                        <Tooltip />

                                        <Bar dataKey="total">

                                            {tvStats.map((entry, index) => (

                                                <Cell
                                                    key={index}
                                                    fill={entry.status ? "#22c55e" : "#ef4444"}
                                                />

                                            ))}

                                        </Bar>

                                        <Bar
                                            dataKey="ativas"
                                            fill="#3b82f6"
                                        />

                                    </BarChart>

                                </ResponsiveContainer>
                        </div>

                    </div>

                    <div className="reports-cards-container">

                        <section id="media-types" className="reports-cards-graficos">

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
                            
                            <div className="reports-cards">
                                <div className="reports-chart-container">

                                    <h2>Estado das Mídias</h2>

                                    <ResponsiveContainer width="90%" height={"100%"}>

                                        <BarChart
                                            data={mediaStatus}
                                            layout="vertical"
                                        >

                                            <XAxis
                                                type="number"
                                                tick={{ fill: axisTextColor, fontSize: 11}}
                                            />

                                            <YAxis
                                                type="category"
                                                dataKey="status"
                                                tick={{ fill: axisTextColor, fontSize: 11}}
                                            />

                                            <Tooltip />

                                            <Bar dataKey="valor">

                                                {mediaStatus.map((entry, index) => (

                                                    <Cell
                                                        key={index}
                                                        fill={entry.fill}
                                                    />

                                                ))}

                                            </Bar>

                                        </BarChart>

                                    </ResponsiveContainer>

                                </div>

                                <div id="bar-legend">
                                    {mediaStatus.map((entry, index) => (
                                        <div key={index} className="bar-legend-item">
                                            <section className="bar-legend-color" style={{ backgroundColor: entry.fill }}></section>    
                                            <p className="bar-legend-text">{entry.status} : {entry.valor}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </section>

                        <section id="media-historico" className="reports-cards-graficos">

                            <div id="card-reports-historico" className="reports-cards">

                                <p>Histórico de Ações</p>
                                <small>Veja as ações realizadas em todo o sistema</small>

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
                            </div>
                            
                        </section>

                    </div>
                        
                </div>
            </main>
        </div>
    )
}