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
        <aside id="home-menu-container">
            <header id="home-aside-header">
                <h1>Menu</h1>
            </header>
            <div id="home-aside-main">
                <button className="menu-buttons" onClick={handlePageMidia}>Midias</button>
                <button className="menu-buttons" onClick={handlePageTv}>TVs</button>
                <button className="menu-buttons" onClick={handlePageHome}>Home</button>
            </div>
        </aside>
    )
}