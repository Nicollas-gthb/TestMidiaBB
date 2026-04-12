import { useNavigate } from "react-router-dom"

import "./Aside.css"

export const Aside = () => {

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
            <header id="aside-aside-header">
                <h1>Menu</h1>
            </header>
            <div id="aside-aside-main">
                <button className="menu-buttons" onClick={handlePageMidia}>Midias</button>
                <button className="menu-buttons" onClick={handlePageTv}>TVs</button>
                <button className="menu-buttons" onClick={handlePageHome}>Home</button>
            </div>
        </aside>
    )
}