import { useState, useEffect, createContext } from "react";

export const ThemeContext = createContext()

export function ThemeProvider({children}){
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light"
    )
    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light"
        setTheme(newTheme)
    }

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme)
        localStorage.setItem("theme", theme)
    }, [theme])

    return (
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}