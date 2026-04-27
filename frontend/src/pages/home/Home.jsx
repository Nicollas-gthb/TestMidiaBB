import { useNavigate} from "react-router-dom"
import { useState, useEffect } from "react"

import "./Home.css"
import { Aside } from "../../components/aside/Aside"
import { Header } from "../../components/header/Header"
import { useToast } from "../../contexts/ToastContext"
import { api } from "../../api/axios"

export default function Home() {

    const [tvs, setTvs] = useState([])
    const [midias, setMidias] = useState([])
    const { addToast } = useToast()
    
    useEffect(() => {
        carregarTvs()
    }, [])

    useEffect(() => {
        carregarMidias()
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
    
        
    const totalTvsAtivas = tvs.filter(tv => tv.ativo).length
    const totalMidiasAtivas = midias.filter(m => calcularStatus(m) === "ativa").length
    const totalMidiasAgendadas = midias.filter(m => calcularStatus(m) === "agendada").length
    const totalMidiasExpiradas = midias.filter(m => calcularStatus(m) === "expirada").length

    return (
        <div id="home-container">

            <Aside />

            <main id="home-main-container">

                <Header />

                <div id="home-menu-main">
                    <h2>Home</h2>

                    <div id="home-cards-container">
                        <div className="home-cards">
                            <div className="home-card-head">
                                <p className="home-card-title">
                                    Tvs Ativas
                                </p>

                                <i className="bi card-bi bi-cast"></i>

                            </div>
                            <p className="home-card-numbers">{totalTvsAtivas}</p>
                            <p className="home-card-info">{`de ${tvs.length} cadastrdas`}</p>
                        </div>

                        <div className="home-cards">
                            <div className="home-card-head">
                                <p className="home-card-title">
                                    Midias Ativas
                                </p>

                                <i className="bi card-bi bi-images"></i>

                            </div>
                            <p className="home-card-numbers">{totalMidiasAtivas}</p>
                            <p className="home-card-info">{`de ${midias.length} cadastrdas`}</p>
                        </div>

                        <div className="home-cards">
                            <div className="home-card-head">
                                <p className="home-card-title">
                                    Midias Agendadas
                                </p>
                                <i className="bi card-bi bi-calendar-event"></i>

                            </div>
                            <p className="home-card-numbers">{totalMidiasAgendadas}</p>
                            <p className="home-card-info">{`de ${midias.length} cadastrdas`}</p>
                        </div>

                        <div className="home-card-head" className="home-cards">
                            <div className="home-card-head">
                                <p className="home-card-title">
                                    Midias Expiradas
                                </p>
                                <i className="bi card-bi bi-clock"></i>

                            </div>
                            <p className="home-card-numbers">{totalMidiasExpiradas}</p>
                            <p className="home-card-info">{`de ${midias.length} cadastrdas`}</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}