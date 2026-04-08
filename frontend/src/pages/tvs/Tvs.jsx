import { useEffect, useState, useRef } from "react"
import { useParams } from "react-router-dom"

import { api } from "../../api/axios"
import "./Tvs.css"

export default function Tv(){
    const { numero } = useParams()
    const [playlist, setPlaylist] = useState([])
    const [indexAtual, setIndexAtual] = useState(0)
    const timerRef = useRef(null)

    const carregarPlaylist = async () => {
        try{
            const response = await api.get(`/tv/${numero}/playlist`)
            setPlaylist(response.data)
            setIndexAtual(0)
        }catch(error){
            console.error("Erro ao carregar playlist", error)
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
                    className="tvs-img" 
                    src={arquivo} 
                    alt="" 
                />
            ) : (
                <video 
                    className="tvs-video"
                    src={arquivo}
                    autoPlay
                    muted
                />
            )}
        </div>
    )
}