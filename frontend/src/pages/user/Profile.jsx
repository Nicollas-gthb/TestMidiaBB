import { useState, useContext, useEffect } from "react"
import { useParams } from "react-router-dom"

import { AuthContext } from "../../contexts/AuthContext"
import { Aside } from "../../components/aside/Aside"
import { Header } from "../../components/header/Header"
import { useToast } from "../../contexts/ToastContext"
import { api } from "../../api/axios"
import { formatarDataHora } from "../../utils/formatters"
import "./Profile.css"

export default function Profile() {

    const { id } = useParams()

    const { user } = useContext(AuthContext)
    const { addToast } = useToast()

    const [editUser, setEditUser] = useState(null)

    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [confirmarSenha, setConfirmarSenha] = useState("")
    const [perfil, setPerfil] = useState("")

    const [loading, setLoading] = useState(false)
    const [vaiAlterar, setVaiAlterar] = useState(false)
    const [typePass, setTypePass] = useState("password")


    const [listaHistorico, setListaHistorico] = useState([])
    const [pagina, setPagina] = useState(1)
    const [totalPaginas, setTotalPaginas] = useState(1)
    // eslint-disable-next-line no-unused-vars
    const [filtroUsuario, setFiltroUsuario] = useState("")
    const [filtroAcao, setFiltroAcao] = useState("")
    const [dataInicio, setDataInicio] = useState("")
    const [dataFim, setDataFim] = useState("")


    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try{

            if(senha != confirmarSenha){
                addToast("As senhas devem ser iguais", "aviso")
                setLoading(false)
                return
            }

            const payload = {}
            if (nome.strip?.() !== "" && nome) payload.nome = nome
            if (email.strip?.() !== "" && email) payload.email = email
            if (senha.strip?.() !== "" && senha) payload.senha = senha
            if (perfil.strip?.() !== "" && perfil) payload.perfil = perfil

            // Se o usuário clicou em salvar mas não alterou nenhum campo
            if (Object.keys(payload).length === 0) {
                addToast("Nenhuma alteração foi feita.", "aviso")
                setLoading(false)
                return
            }

            await api.patch(`/user/${id}`, payload)
            addToast("Perfil atualizado com sucesso !", "sucesso")
            setVaiAlterar(false)
            setSenha("")
            setConfirmarSenha("")


        }catch(error){
            let mensagem = "Erro ao realizar atualização !"
            const apiDetail = error.response?.data?.detail

            if (apiDetail) {
                if (Array.isArray(apiDetail)) {
                    mensagem = apiDetail[0]?.msg || "Erro de validação nos dados."
                } else if (typeof apiDetail === "string") {
                    mensagem = apiDetail
                }
            }
            addToast(mensagem, "erro")
        }finally{
            setLoading(false)
        }
    }

    const buscarHistorico = async () => {
        try{

            const payload = {
                pagina: pagina,
                limite: 20,
                usuario_id: id || undefined,
                acao: filtroAcao || undefined,
                data_inicio: dataInicio || undefined,
                data_fim: dataFim || undefined
            }

            const response = await api.get("/historico/list", {params: payload})

            setListaHistorico(response.data.dados)
            setTotalPaginas(response.data.total_paginas)

            console.log(editUser?.id)

        }catch(error){
            const mensagem = error.response?.data.detail || "Erro ao carregar histórico !"
            addToast(mensagem, "erro")
        }
    }

    useEffect(() => {
        buscarHistorico()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagina, filtroUsuario, filtroAcao, dataInicio, dataFim])

    useEffect(() => {
        const carregarUser = async () => {
            try{
                const response = await api.get(`/user/${id}`)
                setEditUser(response.data)
                addToast("Usuario carregado", "sucesso")
            }catch(error){
                const mensagem = error.response?.data.detail || "Erro ao carregar usuario !"
                addToast(mensagem, "erro")
            }

        }
        carregarUser()

    }, [addToast, id])

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
                            <small>Informações gerais da conta</small>

                            <label htmlFor="profile-id">ID</label>
                            <fieldset disabled="disabled">
                                <input 
                                    type="text" 
                                    name="profile-id"
                                    id="profile-id" 
                                    value={editUser ? editUser?.id : "Não autenticado"} 
                                    onChange={(e) => setNome(e.target.value)}
                                    placeholder="ID do usuário"
                                />
                            </fieldset>
                            
                            <label htmlFor="profile-nome">Nome</label>
                            <fieldset disabled="disabled">
                                <input 
                                    type="text" 
                                    name="profile-nome" 
                                    id="profile-nome" 
                                    value={editUser ? editUser?.nome : "Não autenticado"}
                                    onChange={(e) => setNome(e.target.value)}
                                    placeholder="Seu nome"
                                />
                            </fieldset>

                            <label htmlFor="profile-email">Email</label>
                            <fieldset disabled="disabled">
                                <input 
                                    type="text" 
                                    name="profile-email" 
                                    id="profile-email" 
                                    value={editUser ? editUser?.email : "Não autenticado"}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Seu email"
                                />
                            </fieldset>

                            <label htmlFor="profile-perfil">Perfil</label>
                            <fieldset disabled="disabled">
                                <input 
                                    type="text" 
                                    name="profile-perfil" 
                                    id="profile-perfil" 
                                    value={editUser ? editUser?.perfil : "Não autenticado"}
                                    onChange={(e) => setPerfil(e.target.value)}
                                    placeholder="Seu perfil"
                                />
                            </fieldset>

                        </div>



                        <div className="profile-cards">
                            
                            
                            {vaiAlterar ? (
                                <form 
                                    id="profile-form"
                                    onSubmit={handleSubmit} 
                                    className="profile-form"
                                >
                                    <p>Alterar Informações</p>
                                    <small>Atualize seus dados cadastrais</small>

                                    <label htmlFor="form-nome">Nome</label>
                                    <fieldset disabled="">
                                        <input 
                                            type="text" 
                                            value={nome}
                                            onChange={(e) => setNome(e.target.value)}
                                            minLength="8"
                                            name="form-nome" 
                                            id="form-nome" 
                                            placeholder="Seu nome"
                                        />
                                    </fieldset>

                                    <label htmlFor="form-email">Email</label>
                                    <fieldset disabled="">
                                        <input 
                                            type="text" 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            name="form-email" 
                                            id="form-email" 
                                            placeholder="Novo Email"
                                        />
                                    </fieldset>

                                    <label htmlFor="form-senha">Senha</label>
                                    <fieldset disabled="">
                                        <input 
                                            type={typePass} 
                                            value={senha}
                                            onChange={(e) => setSenha(e.target.value)}
                                            minLength="5"
                                            name="form-senha" 
                                            id="form-senha" 
                                            placeholder="Sua senha"

                                        />

                                        <i 
                                            className={typePass == "text" ? "bi eye bi-eye" : "bi eye bi-eye-slash"}
                                            onClick={() => setTypePass(typePass === "password" ? "text" : "password")}
                                        ></i>
                                    </fieldset>

                                    <label htmlFor="form-confirmar-senha">Confirmar senha</label>
                                    <fieldset disabled="">
                                        <input 
                                            type={typePass} 
                                            value={confirmarSenha}
                                            onChange={(e) => setConfirmarSenha(e.target.value)}
                                            name="form-confirmar-senha" 
                                            id="form-confirmar-senha" 
                                            placeholder="Repita a senha"
                                        />
                                    </fieldset>

                                    {user?.perfil === "admin" && (
                                        <>
                                            <label htmlFor="form-perfil">Perfil</label>
                                            <fieldset disabled="">
                                                <select 
                                                    value={perfil} 
                                                    name="form-perfil" 
                                                    id="form-perfil"
                                                    onChange={(e) => {
                                                        setPerfil(e.target.value)
                                                    }} 
                                                >
                                                    <option value="">Selecione um perfil</option>
                                                    <option value="admin">Administrador</option>
                                                    <option value="operador">Operador</option>
                                                </select>
                                            </fieldset>
                                        </>
                                    )}


                                    <div className="profile-alterar-container">
                                        <button 
                                            className="profile-cancel-button" 
                                            onClick={() => {
                                                setNome("")
                                                setEmail("")
                                                setSenha("")
                                                setConfirmarSenha("")
                                                setPerfil("")
                                                setVaiAlterar(false)
                                            }}
                                        >
                                            Cancelar
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="profile-submit-button"
                                            disabled={loading}
                                        >
                                            {loading ? "Salvando..." : "Salvar alterações"}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                
                                <div className="profile-div">
                                    <p>Fazer Alterações?</p>
                                    <button
                                        className="profile-submit-button"
                                        onClick={() => {
                                            setNome(editUser?.nome || "")
                                            setEmail(editUser?.email || "")
                                            setPerfil(editUser?.perfil || "")
                                            setVaiAlterar(true)
                                        }}
                                    >Clique para alterar</button>
                                </div>
                            )}
                            

                            
                                
                            
                        </div>

                    </section>

                    <section className="profile-section">
                        <div id="profile-historico" className="profile-cards">
                            <p>Histórico de Ações</p>
                            <small>Veja as ações realizadas por você no sistema</small>

                            <section className="profile-historico-controllers">
                                {/* <input
                                    type="text"
                                    placeholder="Nome do usuário"
                                    value={filtroUsuario}
                                    onChange={(e) =>setFiltroUsuario(e.target.value)}
                                    disabled=""
                                /> */}

                                <select
                                    value={filtroAcao}
                                    onChange={(e) => setFiltroAcao(e.target.value)}
                                >
                                    <option value="">Todas as ações</option>
                                    <option value="adicionada">Adicionada</option>
                                    <option value="editada">Editada</option>
                                    <option value="editado">Editado</option>
                                    <option value="deletada">Deletada</option>
                                    <option value="removida">Removida</option>
                                </select>

                                <input
                                    type="date"
                                    value={dataInicio}
                                    onChange={(e) => setDataInicio(e.target.value)}
                                />

                                <input
                                    type="date"
                                    value={dataFim}
                                    onChange={(e) => setDataFim(e.target.value)}
                                />

                                <button
                                    onClick={() => {
                                        setPagina(1)
                                    }}
                                >
                                    <i className="bi bi-funnel"></i>
                                    Filtrar
                                </button>
                            </section>

                            <div className="profile-historico-table">
                                {listaHistorico.length === 0 ? (
                                    <div className="home-card-vazio">
                                        <p>Sem Histórico</p>
                                    </div>
                                ) : (
                                    <table>
                                        
                                        <tbody>
                                            {listaHistorico.map(h => (
                                                <tr key={h.id}>
                                                    <td id="historico-content">
                                                        <span className={`historico-icon home-tag-${h.acao.replace(" ", "-")}`}/>

                                                        <span className="historico-text">
                                                            <p className="historico-main-text">{`${h.entidade} "${h.entidade_nome}" foi ${h.acao}`}</p>

                                                            <p className="historico-sub-text">{h.usuario_nome}</p>
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="historico-data">{formatarDataHora(h.criado_em)}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>

                            <section className="profile-historico-controllers">
                                <button
                                    disabled={pagina === 1}
                                    onClick={() => setPagina(pagina - 1)}
                                >
                                    <i className="bi bi-chevron-left"></i>
                                </button>

                                <span>Página {pagina} de {totalPaginas}</span>

                                <button
                                    disabled={pagina === totalPaginas}
                                    onClick={() => setPagina(pagina + 1)}
                                >
                                    <i className="bi bi-chevron-right"></i>
                                </button>
                            </section>
                        </div>
                    </section>

                </div>
            </main>
        </div>
    )
}