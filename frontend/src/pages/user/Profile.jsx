import { useState, useContext } from "react"

import { AuthContext } from "../../contexts/AuthContext"
import { Aside } from "../../components/aside/Aside"
import { Header } from "../../components/header/Header"
import "./Profile.css"

export default function Profile() {

    const { user } = useContext(AuthContext)

    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [confirmarSenha, setConfirmarSenha] = useState("")
    const [perfil, setPerfil] = useState("")

    const [loading, setLoading] = useState(false)
    const [vaiAlterar, setVaiAlterar] = useState(false)
    const [typePass, setTypePass] = useState("password")

    const handleSubmit = () => {

    }

    return (
        <div id="profile-container">

            <Aside/>

            <main id="profile-main-container">

                <Header />

                <div id="profile-menu-main">
                    <h2>Perfil do Usuário</h2>

                    <section className="profile-section">
                        <div className="profile-cards">
                            
                            <p>Informações Pessoais</p>

                            <label>ID</label>
                            <fieldset disabled="disabled">
                                <input type="text" name="" id="" value={user ? user?.id : "Não autenticado"} />
                            </fieldset>
                            
                            <label>Nome</label>
                            <fieldset disabled="disabled">
                                <input 
                                type="text" 
                                name="" 
                                id="" 
                                value={user ? user?.nome : "Não autenticado"}
                                placeholder="Seu nome"
                            />
                            </fieldset>

                            <label>Email</label>
                            <fieldset disabled="disabled">
                                <input 
                                type="text" 
                                name="" 
                                id="" 
                                value={user ? user?.email : "Não autenticado"}
                                placeholder="Seu email"
                            />
                            </fieldset>

                            <label>Perfil</label>
                            <fieldset disabled="disabled">
                                <input 
                                type="text" 
                                name="" 
                                id="" 
                                value={user ? user?.perfil : "Não autenticado"}
                                placeholder="Seu perfil"
                            />
                            </fieldset>

                        </div>



                        <div className="profile-cards">
                            
                            
                            {vaiAlterar ? (
                                <>
                                    <p>Alterar Informações</p>

                                    <label>Nome</label>
                                    <fieldset disabled="">
                                        <input 
                                        type="text" 
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                        name="" 
                                        id="" 
                                        placeholder="Seu nome"
                                    />
                                    </fieldset>

                                    <label>Email</label>
                                    <fieldset disabled="">
                                        <input 
                                        type="text" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        name="" 
                                        id="" 
                                        placeholder="Novo Email"
                                    />
                                    </fieldset>

                                    <label>Senha</label>
                                    <fieldset disabled="">
                                        <input 
                                            type={typePass} 
                                            value={confirmarSenha}
                                            onChange={(e) => setConfirmarSenha(e.target.value)}
                                            name="" 
                                            id="" 
                                            placeholder="Sua senha"

                                        />

                                        <i 
                                            className={typePass == "text" ? "bi eye bi-eye" : "bi eye bi-eye-slash"}
                                            onClick={() => setTypePass(typePass === "password" ? "text" : "password")}
                                        ></i>
                                    </fieldset>

                                    <label>Confirmar senha</label>
                                    <fieldset disabled="">
                                        <input 
                                            type={typePass} 
                                            value={senha}
                                            onChange={(e) => setSenha(e.target.value)}
                                            name="" 
                                            id="" 
                                            placeholder="Repita a senha"
                                        />
                                    </fieldset>

                                    {user?.perfil === "admin" && (
                                        <>
                                            <label>Perfil</label>
                                            <fieldset disabled="">
                                                <select value={perfil} onChange={(e) => {
                                                    setPerfil(e.target.value)
                                                }} name="" id="">
                                                    <option value="">Selecione um perfil</option>
                                                    <option value="admin">Administrador</option>
                                                    <option value="user">Usuário</option>
                                                </select>
                                            </fieldset>
                                        </>
                                    )}


                                    <div className="profile-alterar-container">
                                        <button className="profile-cancel-button" onClick={() => setVaiAlterar(false)}>
                                            Cancelar
                                        </button>
                                        <button className="profile-submit-button" onClick={handleSubmit}>
                                            Salvar alterações
                                        </button>
                                    </div>
                                </>
                            ) : (
                                
                                <div className="profile-div">
                                    <p>Fazer Alterações?</p>
                                    <button
                                        className="profile-submit-button"
                                        onClick={() => setVaiAlterar(true)}
                                    >Clique para alterar</button>
                                </div>
                            )}
                            

                            
                                
                            
                        </div>

                    </section>

                    <section className="profile-section">
                        <div id="profile-historico" className="profile-cards">

                        </div>
                    </section>

                </div>
            </main>
        </div>
    )
}