import { Link } from "react-router-dom";
import { useState } from "react";

import "./Register.css";

export default function Register() {

    const [loading, setLoading] = useState(false)

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

                        <form  method="post" autoComplete="on">

                            <fieldset className="register-fieldset">
                                <legend className="register-legend">Nome</legend>
                                <input 
                                    className="register-input" 
                                    id="input-nome" 
                                    type="text" 
                                    placeholder="Nome Completo" 
                                    // value={nome}
                                    // onChange={e => setNome(e.target.value)}
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
                                    // value={email}
                                    // onChange={e => setEmail(e.target.value)}
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
                                    // value={senha}
                                    // onChange={e => setSenha(e.target.value)}
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