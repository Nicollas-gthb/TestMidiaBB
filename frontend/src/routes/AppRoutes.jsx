import { useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { Routes, BrowserRouter, Route, Navigate } from "react-router-dom"

import Login from "../pages/login/Login"
import Home from "../pages/home/Home"
import Midia from "../pages/midias/Midia"
import TvConfig from "../pages/tvs/TvConfig"
import Tv from "../pages/tvs/Tvs"
import Register from "../pages/register/Register"

export default function AppRoutes() {
    const { token } = useContext(AuthContext)

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={
                    token ? <Navigate to="/home" /> : <Login />
                } />

                <Route path="/register" element={
                    <Register />
                } />

                <Route path="/home" element={
                    token ? <Home /> : <Navigate to="/login" />
                } />

                <Route path="/midia" element={
                    token ? <Midia /> : <Navigate to="/login" />
                } />

                <Route path="/tv" element={
                    token ? <TvConfig /> : <Navigate to="/login" />
                } />

                {/* Pública — telão não precisa de login */}
                <Route path="/tv/:numero" element={<Tv />} />

                {/* O * no final redireciona qualquer rota desconhecida para o login.  */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    )
}