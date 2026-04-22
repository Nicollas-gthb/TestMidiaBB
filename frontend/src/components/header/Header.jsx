import { useContext } from "react"
import { useNavigate } from "react-router-dom"

import "./Header.css";
import { LogoutButton } from "../logout/LogoutButton"
import { AuthContext } from "../../contexts/AuthContext"
import { ThemeToggle } from "../theme/ThemToggle"
import { ThemeContext } from "../../contexts/ThemeContext";
import logo from "../../assets/bb_logo.svg"
import logo_dark from "../../assets/bb_logo_dark.svg"
import logo_light from "../../assets/bb_logo_light.svg"

export const Header = () => {

    const { logout } = useContext(AuthContext)
    const { theme } = useContext(ThemeContext)

    const navigate = useNavigate()

    function handleLogout(){
        logout()
        navigate("/")
    }

    return (
        <header id="header-menu">
            
            <div id="component-header-left">
                <img id="component-header-img" src={theme === "dark" ? logo_dark : logo_light} alt="logo" /> 
                {/* <h1>LOGO</h1> */}
            </div>

            <nav id="component-header-right">
                <ThemeToggle />
                <LogoutButton onClick={handleLogout}/>
            </nav>
        </header>
    )
}
