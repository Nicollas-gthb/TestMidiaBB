import { useState, useContext } from "react"

import { Link } from "react-router-dom"
import { api } from "../../api/axios"
import { AuthContext } from "../../contexts/AuthContext"
import "./Login.css"
import { useToast } from "../../contexts/ToastContext"
import logo from "../../assets/bb_logo.svg"

export default function Login(){

    const { addToast } = useToast()

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
            <header id="header-inicial">
                <img id="header-img" src={logo} alt="logo" /> 
                {/* <h1>LOGO</h1> */}
            </header>

            <main className="background">
                <section id="login">
                    
                    <div id="box-formulario">

                        <h1 id="login-titulo">Faca seu login para adicionar vagas</h1>

                        <form onSubmit={handleSubmit} method="post" autoComplete="on">

                            <fieldset className="login-fieldset">
                                <legend className="login-legend">Email</legend>
                                <input 
                                    className="login-input" 
                                    id="input-email" 
                                    type="email" 
                                    placeholder="email@dominio.com" 
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required 
                                    maxLength="50"
                                />
                            </fieldset>

                            <fieldset className="login-fieldset">
                                <legend className="login-legend">Senha</legend>
                                <input 
                                    className="login-input" 
                                    id="input-senha" 
                                    type="password" 
                                    placeholder="Sua Senha"
                                    value={senha}
                                    onChange={e => setSenha(e.target.value)}
                                    required 
                                    minLength="5" 
                                    maxLength="50"
                                />
                            </fieldset>

                            
                            <Link to="/register" className="login-link">Criar conta</Link>
                        

                            <button 
                                className="button-enviar" 
                                type="submit" 
                                disabled={loading} 
                            >{loading ? "Carregando..." : "Entrar"}</button>
                        </form>


                    </div>

                    <div id="login-box-imagem"></div>
                </section>
            </main>
        </>
    )
}