import { useNavigate } from "react-router-dom"

import "./Home.css"
import { Aside } from "../../components/aside/Aside"
import { Header } from "../../components/header/Header"

export default function Home() {

    

    return (
        <div id="home-container">

            <Aside />

            <main id="home-main-container">

                <Header />

                <div id="home-menu-main">
                
                </div>
            </main>
        </div>
    )
}