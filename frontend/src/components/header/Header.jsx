import { useContext } from "react"
import { useNavigate } from "react-router-dom"

import "./Header.css";
import { LogoutButton } from "../logout/LogoutButton"
import { AuthContext } from "../../contexts/AuthContext"
import { ThemeToggle } from "../theme/ThemToggle"
import { ThemeContext } from "../../contexts/ThemeContext";
import { Profile } from "../profile/Profile";

import logo_dark from "../../assets/bb_logo_branca.svg"
import logo_light from "../../assets/bb_logo_azul.svg"

export const Header = () => {

    const { logout, user } = useContext(AuthContext)
    const { theme } = useContext(ThemeContext)

    const navigate = useNavigate()

    const handleProfile = () => {

    }

    function handleLogout(){
        logout()
        navigate("/")
    }

    return (
        <header id="header-menu">
            
            <div id="component-header-left">
                <img id="component-header-img" src={theme === "dark" ? logo_dark : logo_light} alt="logo" /> 
            </div>

            <nav id="component-header-right">
                
                
                <Profile onClick={handleProfile} user={user ? user?.name || user?.nome : "Não autenticado"} />
                <ThemeToggle />
                <LogoutButton onClick={handleLogout}/>
            </nav>
        </header>
    )
}
