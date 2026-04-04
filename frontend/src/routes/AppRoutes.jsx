import { Routes, BrowserRouter, Route, Navigate } from "react-router-dom"

import { AuthContext } from "../contexts/AuthContext"
import Home from "../pages/home/Home"
import Midia from "../pages/midias/Midia"

export default function AppRoutes(){

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/home" element={
                    <Home />
                } />

                <Route path="/midias" element={
                    <Midia />
                } />
            </Routes>
        </BrowserRouter>
    )
}