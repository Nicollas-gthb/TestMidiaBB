import { useNavigate } from "react-router-dom"

import "./Home.css"

export default function Home() {

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
        <div id="home-container">

            {/** TODO: converter o aside em um componente */}
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


            <main id="home-main-container">

                {/** TODO: converter o header em um componente */}
                <header id="home-menu-header">
                    <h1>LOGO</h1>
                </header>

                <div id="home-menu-main">
                
                </div>
            </main>
        </div>
    )
}