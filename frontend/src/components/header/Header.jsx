import { useContext } from "react"
import { useNavigate } from "react-router-dom"

import "./Header.css";
import { LogoutButton } from "../logout/LogoutButton"
import { AuthContext } from "../../contexts/AuthContext"
import { ThemeToggle } from "../theme/ThemToggle"
import { ThemeContext } from "../../contexts/ThemeContext";
import { Profile } from "../profile/ProfileButton";
import { useToast } from "../../contexts/ToastContext"

import logo_dark from "../../assets/bb_logo_branca.svg"
import logo_light from "../../assets/bb_logo_azul.svg"

export const Header = () => {

    const { logout, user } = useContext(AuthContext)
    const { theme } = useContext(ThemeContext)
    const { addToast } = useToast()

    const navigate = useNavigate()

    const handleProfile = () => {
        try{
            navigate(`/profile/${user?.id}`)
        }catch(error){
            const mensagem = error.response?.data?.detail || "Erro ao acessar perfil !"
            addToast(mensagem, "erro")
            navigate("/login")
        }
    }

    function handleLogout(){
        logout()
        navigate("/")
    }

    return (
        <header className="header-menu">
            
            <nav className="component-header-left">
                <img id="component-header-img" src={theme === "dark" ? logo_dark : logo_light} alt="logo" /> 
            </nav>

            <nav className="component-header-right">
                
                
                <Profile onClick={handleProfile} user={user ? user?.name || user?.nome : "Não autenticado"} />

                <div className="header-divider"></div>

                <ThemeToggle />

                <div className="header-divider"></div>

                <LogoutButton onClick={handleLogout}/>
            </nav>
        </header>
    )
}
