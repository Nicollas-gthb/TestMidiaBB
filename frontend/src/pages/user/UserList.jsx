import { useState, useEffect } from "react";

import "./UserList.css";
import { useToast } from "../../contexts/ToastContext";
import { Aside } from "../../components/aside/Aside";
import { Header } from "../../components/header/Header";
import { api } from "../../api/axios";

export default function UserList() {
    
    const { addToast } = useToast()

    const [users, setUsers] = useState([])

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
                                    <th>ID</th>
                                    <th>NOME</th>
                                    <th>EMAIL</th>
                                    <th>PERFIL</th>
                                    <th>STATUS</th>
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
                                            <div className="status">
                                                {u.status}
                                            </div>
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