import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"

import "./Register.css"
import { api } from "../../api/axios"
import { useToast } from "../../contexts/ToastContext"

export default function Register() {

    const { addToast } = useToast()

    const [loading, setLoading] = useState(false)

    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        let payload = {
            nome: nome,
            email: email,
            senha: senha
        }

        try{
            const response = await api.post("/user/register", payload)
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
            <header id="header-inicial">
                {/* <img id="header-img" src={logo} alt="logo" />  */}
                <h1>LOGO</h1>
            </header>

            <main className="background">
                <section id="register">

                    <div id="register-box-imagem"></div>

                    <div id="register-box-formulario">

                        <h1 id="register-titulo">Faça seu cadastro</h1>

                        <form onSubmit={handleSubmit} method="post" autoComplete="on">

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

                            <Link to="/login" className="login-link">Já tenho conta</Link>

                            <button 
                                className="button-enviar" 
                                type="submit" 
                                disabled={loading} 
                            >{loading ? "Carregando..." : "Cadastrar"}</button>
                        </form>
                    </div>
                </section>
            </main>
        </>
    )
}