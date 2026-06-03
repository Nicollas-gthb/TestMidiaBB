import { useNavigate } from "react-router-dom"

import "./Aside.css"
import { useAside } from "../../contexts/AsideContext"

export const Aside = () => {
    const navigate = useNavigate()
    const isActive = (path) => location.pathname === path

    // No mobile começa colapsado, no desktop expandido
    const {collapsed, setCollapsed} = useAside()

    return (
        <aside id="aside-menu-container" className={collapsed ? "aside-collapsed" : ""}>
            <header id="aside-header">
                <button 
                    id="aside-toggle"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <i className={`bi aside-bi ${collapsed ? "bi-layout-sidebar" : "bi-layout-sidebar-reverse"}`}></i>
                </button>
                {!collapsed && <h1>Menu</h1>}
            </header>

            <div id="aside-main">
                
                <button
                    className={`menu-buttons ${isActive("/home") ? "menu-active" : "menu-inactive"}`}
                    onClick={() => navigate("/home")}
                    title="Home"
                >
                    <i className="bi aside-bi bi-house"></i>
                    {!collapsed && <span>Home</span>}
                </button>

                <div className="nav-group">
                    {!collapsed && <p className="nav-group-title">Midias</p>}

                    <button className="menu-buttons menu-inactive" onClick={() => navigate("/midia")} title="M. Ativas">
                        <i className="bi aside-bi bi-image"></i>
                        {!collapsed && <span>M. Ativas</span>}
                    </button>

                    <button className="menu-buttons menu-inactive" onClick={() => navigate("/midia")} title="M. Agendadas">
                        <i className="bi aside-bi bi-calendar-event"></i>
                        {!collapsed && <span>M. Agendadas</span>}
                    </button>

                    <button className="menu-buttons menu-inactive" onClick={() => navigate("/midia")} title="M. Expiradas">
                        <i className="bi aside-bi bi-clock"></i>
                        {!collapsed && <span>M. Expiradas</span>}
                    </button>

                    <button className="menu-buttons menu-inactive" onClick={() => navigate("/midia")} title="Todas as Mídias">
                        <i className="bi aside-bi bi-list-ul"></i>
                        {!collapsed && <span>Todas as Midias</span>}
                    </button>
                </div>

                <div className="nav-group">
                    {!collapsed && <p className="nav-group-title">TVs</p>}

                    <button className="menu-buttons menu-inactive" onClick={() => navigate("/tv")} title="TVs Ativas">
                        <i className="bi aside-bi bi-tv"></i>
                        {!collapsed && <span>TVs Ativas</span>}
                    </button>

                    <button className="menu-buttons menu-inactive" onClick={() => navigate("/tv")} title="TVs Offline">
                        <i className="bi aside-bi bi-wifi-off"></i>
                        {!collapsed && <span>TVs Offline</span>}
                    </button>

                    <button className="menu-buttons menu-inactive" onClick={() => navigate("/tv")} title="Todas as TVs">
                        <i className="bi aside-bi bi-list-ul"></i>
                        {!collapsed && <span>Todas as TVS</span>}
                    </button>
                </div>

                <div className="nav-group">
                    {!collapsed && <p className="nav-group-title">Relatórios</p>}

                    <button className="menu-buttons menu-inactive" onClick={() => navigate("/reports")} title="Log Atividades">
                        <i className="bi aside-bi bi-card-heading"></i>
                        {!collapsed && <span>Log Atividades</span>}
                    </button>

                    <button className="menu-buttons menu-inactive" onClick={() => navigate("/reports")} title="Relatórios">
                        <i className="bi aside-bi bi-file-earmark-bar-graph"></i>
                        {!collapsed && <span>Relatórios</span>}
                    </button>
                </div>

                <div className="nav-group">
                    {!collapsed && <p className="nav-group-title">Configurações</p>}

                    <button className="menu-buttons menu-inactive" onClick={() => navigate("/user/list")} title="Usuários">
                        <i className="bi aside-bi bi-person"></i>
                        {!collapsed && <span>Usuários</span>}
                    </button>

                    <button className="menu-buttons menu-inactive" title="Auths">
                        <i className="bi aside-bi bi-shield-lock"></i>
                        {!collapsed && <span>Auths</span>}
                    </button>

                    <button className="menu-buttons menu-inactive" title="Configs">
                        <i className="bi aside-bi bi-gear"></i>
                        {!collapsed && <span>Configs</span>}
                    </button>
                </div>
            </div>
        </aside>
    )
}