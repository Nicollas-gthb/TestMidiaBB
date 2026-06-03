import { useContext } from "react"

import "./ThemeToggle.css"
import { ThemeContext } from "../../contexts/ThemeContext"

export const ThemeToggle = () => {

    const {theme, toggleTheme} = useContext(ThemeContext)

    return (
        
        <button
            onClick={toggleTheme}
            
            className="header-action theme-btn"
        >
            <i
                className={
                    theme === "light"
                        ? "bi bi-sun-fill"
                        : "bi bi-moon-stars-fill"
                }
            />

            <p id="theme-text"> Tema {theme === "light" ? "Claro" : "Escuro"}</p>
            
            
        </button>
        
    )
}