import { useEffect, useState, useRef } from "react"
import { useParams } from "react-router-dom"

import { api } from "../../api/axios"
import "./Tvs.css"
import { useToast } from "../../contexts/ToastContext"

export default function Tv(){

    const { addToast } = useToast()

    const { numero } = useParams()
    const [playlist, setPlaylist] = useState([])
    const [indexAtual, setIndexAtual] = useState(0)
    const timerRef = useRef(null)

    const carregarPlaylist = async () => {
        try{
            const response = await api.get(`/tv/${numero}/playlist`)
            setPlaylist(response.data)
            setIndexAtual(0)
            addToast("Playlist carregada !", "sucesso")
        }catch(error){
            const mensagem = error.response?.data.detail || "Erro ao carregar playlist !"
            addToast(mensagem, "erro")
        }
    }

    useEffect(() => {
        carregarPlaylist()
    }, [numero])

    useEffect(() => {
        if(playlist.length === 0) return

        const item = playlist[indexAtual]
        const duracao = item.midia.duracao_segundos * 1000

        timerRef.current = setTimeout(() => {
            if(indexAtual + 1 < playlist.length){
                //Se não for o ultimo item, passa pra frente
                setIndexAtual(indexAtual + 1)
            }else{
                //Caso contrario recarrega a playlist e volta do inicio
                carregarPlaylist()
            }
        }, duracao)

        return () => clearTimeout(timerRef.current)

    }, [playlist, indexAtual])

    if (playlist.length === 0) {
        return (
            <div id="tvs-container-vazio">
                <p id="tvs-mensagem-vazia">Nenhuma mídia disponível</p>
            </div>
        )
    }

    const itemAtual = playlist[indexAtual]
    const { tipo, arquivo } = itemAtual.midia

    return (
        <div id="tvs-container">
            {tipo === "image" ? (
                <img
                    key={arquivo}
                    className="tvs-img" 
                    src={arquivo} 
                    alt="" 
                />
            ) : (
                <video 
                    key={arquivo}
                    className="tvs-video"
                    src={arquivo}
                    autoPlay
                    muted
                />
            )}
        </div>
    )
}