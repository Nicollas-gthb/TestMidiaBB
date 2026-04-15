import { useContext } from "react"
import { useNavigate } from "react-router-dom"

import "./Header.css";
import { LogoutButton } from "../logout/LogoutButton";
import { AuthContext } from "../../contexts/AuthContext";
import { ThemeToggle } from "../theme/ThemToggle";

export const Header = () => {

    const { logout } = useContext(AuthContext)
    const navigate = useNavigate()

    function handleLogout(){
        logout()
        navigate("/")
    }

    return (
        <header id="header-menu">
            
            <div id="component-header-left">
                <h1>LOGO</h1>
            </div>

            <nav id="component-header-right">
                <ThemeToggle />
                <LogoutButton onClick={handleLogout}/>
            </nav>
        </header>
    )
}
