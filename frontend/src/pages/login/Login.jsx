
import { useState, useContext } from "react"

import { Link } from "react-router-dom"
import { api } from "../../api/axios"
import { AuthContext } from "../../contexts/AuthContext"
import { ThemeContext } from "../../contexts/ThemeContext"
import "./Login.css"
import { useToast } from "../../contexts/ToastContext"

import logo_amarela from "../../assets/bb_logo_amarela.svg"
import icon_amarela from "../../assets/bb_icon_amarela.svg"
import vector_amarela from "../../assets/bb_vector_amarela.svg"

import logo_azul from "../../assets/bb_logo_azul.svg"
import icon_azul from "../../assets/bb_icon_azul.svg"
import vector_azul from "../../assets/bb_vector_azul.svg"

export default function Login(){

    const { addToast } = useToast()
    const { theme } = useContext(ThemeContext)

    //quando o use context é usado, ele volta na primeira tag <AuthContext.Provider> 
    // que encontrar, e procura no value o { login }
    const { login } = useContext(AuthContext)

    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [loading, setLoading] = useState(false)

    

    async function handleSubmit(e){
        e.preventDefault()
        setLoading(true)

        let payload = {
            email: email,
            senha: senha
        }

        try{
            const response = await api.post("/auth/login", payload)

            login(response.data.access_token, response.data.user)

            addToast("Login realizado !", "sucesso")

        }catch(error){
            const mensagem = error.response?.data?.detail || "Erro ao fazer login !"
            addToast(mensagem, "erro")
            
        }finally{
            setLoading(false)
        }
    }

    return (
        <>
            

            <main className="login-page">

                <div className="bb-decoration bb-top">
                    <img src={theme === "dark" ? icon_amarela : icon_azul} alt="" />
                </div>

                <div className="bb-decoration bb-left"></div>
                <div className="bb-decoration bb-right"></div>

                <div className="bb-decoration bb-bottom">
                    <img src={theme === "dark" ? vector_amarela : vector_azul} alt="" />
                </div>

                <section className="login-card">

                    <img
                        src={theme === "dark" ? logo_amarela : logo_azul}
                        alt="Banco do Brasil"
                        className="login-logo"
                    />

                    <h1 className="login-title">
                        Bem-vindo de volta!
                    </h1>

                    <p className="login-subtitle">
                        Faça login para acessar sua conta e continuar.
                    </p>

                    <form onSubmit={handleSubmit}>

                        <div className="input-group">
                            <label>
                                <i className="bi bi-envelope-at"></i>
                                Email
                            </label>

                            <input
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>
                                <i className="bi bi-lock"></i>
                                Senha
                            </label>

                            <input
                                type="password"
                                placeholder="Sua senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                            />
                        </div>

                        <Link
                            to="/recuperar-senha"
                            className="forgot-password"
                        >
                            Esqueceu sua senha?
                        </Link>

                        <button
                            type="submit"
                            disabled={loading}
                            className="login-button"
                        >
                            {loading
                                ? "Carregando..."
                                : "Entrar"}
                        </button>

                        <div className="register-area">
                            Ainda não tem uma conta?

                            <Link to="/register">
                                Criar conta
                            </Link>
                        </div>

                    </form>

                </section>

            </main>
        </>
    )
}