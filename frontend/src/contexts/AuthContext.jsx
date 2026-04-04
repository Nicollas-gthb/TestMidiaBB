import { createContext, useState, useEffect } from "react"

export const AuthContext = createContext()

export function AuthProvider({children}){
    const [token, setToken] = useState(
        localStorage.getItem("token") || null
    )
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const savedUser = localStorage.getItem("user")
        const savedToken = localStorage.getItem("token")

        if(savedToken && savedUser){
            setUser(JSON.parse(savedUser))
            setToken(savedToken)
            //JSON.parse -> converte a string em um objeto para usar fora do localStorage
        }

        setLoading(false)
    }, [])

    function login(newToken, userData){
        localStorage.setItem("token", newToken)
        localStorage.setItem("user", JSON.stringify(userData)) 
        //JSON.stringify -> converte o objeto em uma string para ser salva no localStorage

        setToken(newToken)
        setUser(userData)
    }

    function logout(){
        localStorage.removeItem("token")
        localStorage.removeItem("user")

        setToken(null)
        setUser(null)
    }

    return (
        //auth context provider, disponibiliza 
        // o token e as funções de login e logout para os componentes filhos
        // esses filhos são todas as telas do app, pois o provider é usado no App.jsx
        <AuthContext.Provider value={{ token, user, login, logout, loading }}> 
            {children}
        </AuthContext.Provider>
    )
}