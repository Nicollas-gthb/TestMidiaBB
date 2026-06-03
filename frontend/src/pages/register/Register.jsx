import { Link, useNavigate } from "react-router-dom"
import { useState, useContext } from "react"

import "./Register.css"
import { api } from "../../api/axios"
import { useToast } from "../../contexts/ToastContext"
import { ThemeContext } from "../../contexts/ThemeContext"

import logo_amarela from "../../assets/bb_logo_amarela.svg"
import icon_amarela from "../../assets/bb_icon_amarela.svg"
import vector_amarela from "../../assets/bb_vector_amarela.svg"

import logo_azul from "../../assets/bb_logo_azul.svg"
import icon_azul from "../../assets/bb_icon_azul.svg"
import vector_azul from "../../assets/bb_vector_azul.svg"

export default function Register() {

    const { addToast } = useToast()
    const { theme } = useContext(ThemeContext)
    

    const [loading, setLoading] = useState(false)

    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [confirmar, setConfirmar] = useState("")

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        if(senha != confirmar){
            addToast("As senhas devem ser iguais", "aviso")
            setLoading(false)
            return
        }

        const payload = {
            nome,
            email,
            senha
        }

        try{
            await api.post("/user/register", payload)
            addToast("Usuario cadastrado com sucesso !", "sucesso")
            navigate("/home")
        }catch(error){
            const mensagem = error.response?.data?.detail || "Erro ao realizar cadastro !"
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
                        Novo por aqui?
                    </h1>

                    <p className="login-subtitle">
                        Crie sua conta para acessar seus serviços.
                    </p>

                    <form onSubmit={handleSubmit}>

                        <div className="input-group">
                            <label>
                                <i className="bi bi-person"></i>
                                Nome
                            </label>

                            <input
                                type="text"
                                placeholder="Seu nome "
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                maxLength="50"
                                minLength="2"
                                required
                            />
                        </div>

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
                                minLength="5" 
                                maxLength="50"
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
                                minLength="5" 
                                maxLength="50"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>
                                <i className="bi bi-lock"></i>
                                Confirmar Senha
                            </label>

                            <input
                                type="password"
                                placeholder="Confirme sua senha"
                                value={confirmar}
                                onChange={(e) => setConfirmar(e.target.value)}
                                minLength="5"
                                maxLength="50"
                                required
                            />
                        </div>


                        <button
                            type="submit"
                            disabled={loading}
                            className="login-button"
                        >
                            {loading
                                ? "Carregando..."
                                : "Cadastrar"}
                        </button>

                        <div className="register-area">
                            Já tem uma conta?

                            <Link to="/login">
                                Fazer login
                            </Link>
                        </div>

                    </form>

                </section>

            </main>
        </>
    )
}

/**
 * <form onSubmit={handleSubmit} method="post" autoComplete="on">

                            <fieldset className="register-fieldset">
                                <legend className="register-legend">Nome</legend>
                                <input 
                                    className="register-input" 
                                    id="input-nome" 
                                    type="text" 
                                    placeholder="Nome Completo" 
                                    value={nome}
                                    onChange={e => setNome(e.target.value)}
                                    required 
                                    maxLength="50"
                                />
                            </fieldset>

                            <fieldset className="register-fieldset">
                                <legend className="register-legend">Email</legend>
                                <input 
                                    className="register-input" 
                                    id="input-email" 
                                    type="email" 
                                    placeholder="email@dominio.com" 
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required 
                                    maxLength="50"
                                />
                            </fieldset>

                            <fieldset className="register-fieldset">
                                <legend className="register-legend">Senha</legend>
                                <input 
                                    className="register-input" 
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

                            <fieldset className="register-fieldset">
                                <legend className="register-legend">Confirmar senha</legend>
                                <input 
                                    className="register-input" 
                                    id="input-senha" 
                                    type="password" 
                                    placeholder="Sua Senha"
                                    value={confirmar}
                                    onChange={e => setConfirmar(e.target.value)}
                                    required 
                                    minLength="5" 
                                    maxLength="50"
                                />
                            </fieldset>

                            <Link to="/login" className="login-link">Já tenho conta</Link>

                            <button 
                                className="button-enviar" 
                                type="submit" 
                                disabled={loading} 
                            >{loading ? "Carregando..." : "Cadastrar"}</button>
                        </form>
 */