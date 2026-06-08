import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import "./UserList.css";
import { useToast } from "../../contexts/ToastContext";
import { Aside } from "../../components/aside/Aside";
import { Header } from "../../components/header/Header";
import { api } from "../../api/axios";
import { AuthContext } from "../../contexts/AuthContext";

export default function UserList() {
    
    const { addToast } = useToast()
    const { user } = useContext(AuthContext)

    const [users, setUsers] = useState([])
    const navigate = useNavigate()

    const handleEdit = (user) => {
        
        try{
            navigate(`/profile/${user.id}`)
        }catch(error){
            const mensagem = error.response?.data?.detail || "Erro ao acessar perfil !"
            addToast(mensagem, "erro")
            navigate("/login")
        }
    }

    useEffect(() => {
        const buscarUsers = async () => {
            try{
                const response = await api.get("/user/list")
                setUsers(response.data)
                addToast("Usuarios carregados !", "sucesso")
            }catch(error){
                const mensagem = error.response?.data?.detail || "Erro ao carregar usuarios !";
                addToast(mensagem, "erro")
            }
        }

        buscarUsers()
    }, [addToast])

    

    return (
        <div id="userlist-container">

            <Aside />

            <main id="userlist-main-container">

                <Header />

                <div id="userlist-menu-main">

                    <h2>Lista de Usuarios</h2>

                    <div className="table-title">
                    </div>

                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th className="left-table">ID</th>
                                    <th>NOME</th>
                                    <th>EMAIL</th>
                                    <th>PERFIL</th>
                                    <th>STATUS</th>
                                    <th className="right-table">AÇÕES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id}>
                                        <td>{u.id}</td>
                                        <td>{u.nome}</td>
                                        <td>{u.email}</td>
                                        <td>{u.perfil}</td>
                                        <td>
                                            <div className={`status status-${u.ativo ? 'ativa' : 'removida'}`}>
                                                {u.ativo ? "Ativo" : "Inativo"}
                                            </div>
                                        </td>
                                        <td>
                                            {user.perfil == "admin" ? (
                                                <button
                                                    className="second-action-button"
                                                    onClick={() => handleEdit(u)}
                                                >
                                                    <i className="bi bi-pencil-square"></i>
                                                </button>
                                            ) : (
                                                <p> - </p>
                                            )}
                                        </td>
                                        
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </main>
        </div>
    )
}