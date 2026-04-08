import { useEffect, useState } from "react"

import "./Midia.css"
import { AddMidia } from "../../components/midia/AddMidia"
import { api } from "../../api/axios"

export default function Midia() {

    const [addMidiaAberto, setAddMidiaAberto] = useState(false)

    const [midias, setMidias] = useState([])

    const carregarMidias = async () => {
        try{
            const response = await api.get("/midias/")
            setMidias(response.data)
        }catch(error){
            console.error("Erro ao carregar mídias", error)
        }
    }

    useEffect(() => {
        carregarMidias()
    }, [])

    const handleDeletar = async (id) => {
        try{
            await api.delete(`/midias/${id}`)
            carregarMidias()
        }catch(error){
            console.error("Erro ao deletar mídia", error)
        }
    }

    return (
        <div id="midia-container">

            {/** TODO: converter o aside em um componente */}
            <aside id="midia-menu-container">
                <header id="midia-aside-header">
                    <h1>Menu</h1>
                </header>
                <div id="midia-aside-main">
                    <button className="menu-buttons">Botão 1</button>
                    <button className="menu-buttons">Botão 2</button>
                    <button className="menu-buttons">Botão 3</button>
                </div>
            </aside>


            <main id="midia-main-container">

                {/** TODO: converter o header em um componente */}
                <header id="midia-menu-header">
                    <h1>LOGO</h1>
                </header>

                <div id="midia-menu-main">

                    <div className="table-title">

                        <h2>Gestão de midias</h2>
        
                        <button 
                            className="action-button"
                            onClick={() => {setAddMidiaAberto(true)}}
                        >
                            <i className="bi bi-arrow-bar-up"></i>
                            Nova midia
                        </button>

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
                                    <th>VALIDADE</th>
                                    <th>Duração</th>
                                    <th>URL</th>
                                    <th className="right-table">AÇÕES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {midias.map(midia => (
                                    <tr key={midia.id}>
                                        <td>{midia.id}</td>
                                        <td>{midia.nome}</td>
                                        <td>{midia.tipo}</td>
                                        <td>{midia.tvs.map(tv => `TV ${tv.numero}`).join(", ") || "—"}</td>
                                        <td>{midia.ativo ? "Ativa" : "Inativa"}</td>
                                        <td>{midia.validade ?? "—"}</td>
                                        <td>{midia.duracao_segundos}s</td>
                                        <td>
                                            <a href={midia.arquivo} target="_blank" rel="noreferrer">
                                                Ver arquivo
                                            </a>
                                        </td>
                                        <td>
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
                                        <td colSpan={8} style={{ textAlign: "center" }}>
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
                </div>
            </main>
        </div>
    )
}