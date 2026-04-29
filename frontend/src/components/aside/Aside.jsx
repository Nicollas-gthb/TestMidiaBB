import { useNavigate, useLocation } from "react-router-dom"

import "./Aside.css"
import { useToast } from "../../contexts/ToastContext"


export const Aside = () => {

    const { addToast } = useToast()

    const navigate = useNavigate()
    const isActive = (path) => location.pathname === path

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

                <hr />

                
                    <p className=" processo">em processo</p>

                <button
                    className={`menu-buttons processo ${isActive("/tv") ? "menu-active" : "menu-inactive"}`}
                    
                >
                    <i className="bi aside-bi bi-wifi-off"></i>
                    TVs Offline
                </button>
                
                <button
                    className={`menu-buttons processo ${isActive("/tv") ? "menu-active" : "menu-inactive"}`}
                    
                >
                    <i className="bi aside-bi bi-card-heading"></i>
                    Log de Atividades
                </button>
                
                <button
                    className={`menu-buttons processo ${isActive("/tv") ? "menu-active" : "menu-inactive"}`}
                    
                >
                    <i className="bi aside-bi bi-file-earmark-bar-graph"></i>
                    Relatórios
                </button>

                <button
                    className={`menu-buttons processo ${isActive("/tv") ? "menu-active" : "menu-inactive"}`}
                    
                >
                    <i className="bi aside-bi bi-person"></i>
                    Usuários
                </button>
                
                <button
                    className={`menu-buttons processo ${isActive("/tv") ? "menu-active" : "menu-inactive"}`}
                    
                >
                    {/* <i ="bi  bi-gear"></i> */}
                    <i className="bi aside-bi bi-shield-lock"></i>
                    Auths
                </button>

                <button
                    className={`menu-buttons processo ${isActive("/tv") ? "menu-active" : "menu-inactive"}`}
                    
                >
                    <i className="bi aside-bi bi-gear"></i>
                    Configs
                </button>

                
            </div>
        </aside>
    )
}