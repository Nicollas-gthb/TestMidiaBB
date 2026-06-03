import { useContext } from "react"

import { AuthContext } from "../../contexts/AuthContext"
import { Aside } from "../../components/aside/Aside"
import { Header } from "../../components/header/Header"
import "./Profile.css"

export default function Profile() {

    const { user } = useContext(AuthContext)

    return (
        <div id="profile-container">

            <Aside/>

            <main id="profile-main-container">

                <Header />

                <div id="profile-menu-main">
                    <h2>Perfil do Usuário</h2>

                    <p><strong>Nome:</strong> {user?.name || user?.nome}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Perfil:</strong> {user?.perfil}</p>

                    <div className="table-title">
                    </div>
                </div>
            </main>
        </div>
    )
}