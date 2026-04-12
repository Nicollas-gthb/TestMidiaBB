import { useNavigate } from "react-router-dom"

import "./Home.css"
import { Aside } from "../../components/aside/Aside"

export default function Home() {

    

    return (
        <div id="home-container">

            <Aside />

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