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