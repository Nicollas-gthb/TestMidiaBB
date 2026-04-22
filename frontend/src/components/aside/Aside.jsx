import { useNavigate } from "react-router-dom"

import "./Aside.css"
import { useToast } from "../../contexts/ToastContext"


export const Aside = () => {

    const { addToast } = useToast()

    const navigate = useNavigate()

    const handlePageMidia = () => {
        navigate("/midia")
    }

    const handlePageTv = () => {
        navigate("/tv")
    }

    const handlePageHome = () => {
        navigate("/home")
    }

    return (
        <aside id="aside-menu-container">
            <header id="aside-header">
                <h1>Menu</h1>
            </header>
            <div id="aside-main">
                <button className="menu-buttons" onClick={handlePageMidia}>Midias</button>
                <button className="menu-buttons" onClick={handlePageTv}>TVs</button>
                <button className="menu-buttons" onClick={handlePageHome}>Home</button>

                {/* <hr />

                <div id="aside-teste">
                    <h2>Teste dos toasts</h2>

                    <button 
                        id="toast-s" 
                        className="aside-teste-button"
                        onClick={() => addToast("Teste 1 mais longo", "sucesso")}
                    >Sucesso</button>
                    <button 
                        id="toast-e" 
                        className="aside-teste-button"
                        onClick={() => addToast("Teste 2", "erro")}
                    >Erro</button>
                    <button 
                        id="toast-a" 
                        className="aside-teste-button"
                        onClick={() => addToast("Teste 3", "aviso")}
                    >Aviso</button>
                    <button 
                        id="toast-i" 
                        className="aside-teste-button"
                        onClick={() => addToast("Teste 4", "info")}
                    >Info</button>

                </div> */}
            </div>
        </aside>
    )
}