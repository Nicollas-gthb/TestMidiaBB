import { useNavigate, useLocation } from "react-router-dom"

import "./Aside.css"
import { useToast } from "../../contexts/ToastContext"


export const Aside = () => {

    const { addToast } = useToast()

    const navigate = useNavigate()
    const isActive = (path) => location.pathname === path

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
                <button
                    className={`menu-buttons ${isActive("/home") ? "menu-active" : "menu-inactive"}`}
                    onClick={() => navigate("/home")}
                >
                    <i className={`bi aside-bi bi-house`}></i>
                    Home
                </button>
                <button
                    className={`menu-buttons ${isActive("/midia") ? "menu-active" : "menu-inactive"}`}
                    onClick={() => navigate("/midia")}
                >
                    <i className="bi aside-bi bi-image"></i>
                    Mídias
                </button>
                <button
                    className={`menu-buttons ${isActive("/tv") ? "menu-active" : "menu-inactive"}`}
                    onClick={() => navigate("/tv")}
                >
                    <i className="bi aside-bi bi-tv"></i>
                    TVs
                </button>

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