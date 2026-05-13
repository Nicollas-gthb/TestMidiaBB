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
                    className={`menu-buttons processo ${isActive("/home") ? "menu-active" : "menu-inactive"}`}
                    onClick={() => navigate("/home")}
                >
                    <i className={`bi aside-bi bi-house`}></i>
                    Home
                </button>

                <div className="nav-group">
                    <p className="nav-group-title">Midias</p>

                    <button
                        className={`menu-buttons processo ${isActive("/teste") ? "menu-active" : "menu-inactive"}`}
                        onClick={() => navigate("/midia")}
                    >
                        <i className="bi aside-bi bi-image"></i>
                        M. Ativas
                    </button>

                    <button
                        className={`menu-buttons processo ${isActive("/teste") ? "menu-active" : "menu-inactive"}`}
                        onClick={() => navigate("/midia")}
                    >
                        <i className="bi aside-bi bi-calendar-event"></i>
                        M. Agendadas
                    </button>
                    <button
                        className={`menu-buttons processo ${isActive("/teste") ? "menu-active" : "menu-inactive"}`}
                        onClick={() => navigate("/midia")}
                    >
                        <i className="bi aside-bi bi-clock"></i>
                        M. Expiradas
                    </button>
                    <button
                        className={`menu-buttons processo ${isActive("/teste") ? "menu-active" : "menu-inactive"}`}
                        onClick={() => navigate("/midia")}
                    >
                        <i className="bi aside-bi bi-list-ul"></i>
                        Todas as Midias
                    </button>

                </div>

                <div className="nav-group">

                    <p className="nav-group-title">TVs</p>

                    <button
                        className={`menu-buttons processo ${isActive("/teste") ? "menu-active" : "menu-inactive"}`}
                        onClick={() => navigate("/tv")}
                    >
                        <i className="bi aside-bi bi-tv"></i>
                        TVs Ativas
                    </button>

                    <button
                        className={`menu-buttons processo ${isActive("/teste") ? "menu-active" : "menu-inactive"}`}
                        onClick={() => navigate("/tv")}
                    >
                        <i className="bi aside-bi bi-wifi-off"></i>
                        TVs Offline
                    </button>

                    <button
                        className={`menu-buttons processo ${isActive("/teste") ? "menu-active" : "menu-inactive"}`}
                        onClick={() => navigate("/tv")}
                    >
                        <i className="bi aside-bi bi-list-ul"></i>
                        Todas as TVS
                    </button>

                </div>


                <div className="nav-group">

                    <p className="nav-group-title">Relatórios</p>

                    <button
                        className={`menu-buttons processo ${isActive("/teste") ? "menu-active" : "menu-inactive"}`}
                    >
                        <i className="bi aside-bi bi-card-heading"></i>
                        Log Atividades
                    </button>
                    
                    <button
                        className={`menu-buttons processo ${isActive("/teste") ? "menu-active" : "menu-inactive"}`}
                    >
                        <i className="bi aside-bi bi-file-earmark-bar-graph"></i>
                        Relatórios
                    </button>

                </div>


                <div className="nav-group">

                    <p className="nav-group-title">Configurações</p>

                    <button
                        className={`menu-buttons processo ${isActive("/teste") ? "menu-active" : "menu-inactive"}`}
                    >
                        <i className="bi aside-bi bi-person"></i>
                        Usuários
                    </button>
                    
                    <button
                        className={`menu-buttons processo ${isActive("/teste") ? "menu-active" : "menu-inactive"}`}
                    >
                        <i className="bi aside-bi bi-shield-lock"></i>
                        Auths
                    </button>

                    <button
                        className={`menu-buttons processo ${isActive("/teste") ? "menu-active" : "menu-inactive"}`}
                    >
                        <i className="bi aside-bi bi-gear"></i>
                        Configs
                    </button>
                </div>

                
                
                

            

                
            </div>
        </aside>
    )
}