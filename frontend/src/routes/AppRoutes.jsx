import { useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { Routes, BrowserRouter, Route, Navigate } from "react-router-dom"

export default function AppRoutes(){
    const { token } = useContext(AuthContext)

    return (
        <BrowserRouter>
            <Routes>
            </Routes>
        </BrowserRouter>
    )
}