import { Routes, BrowserRouter, Route, Navigate } from "react-router-dom"

import { AuthContext } from "../contexts/AuthContext"
import Home from "../pages/home/Home"
import Midia from "../pages/midias/Midia"
import Tv from "../pages/tvs/Tvs"

export default function AppRoutes(){

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/home" element={
                    <Home />
                } />

                <Route path="/midia" element={
                    <Midia />
                } />

                <Route path="/tv/:numero" element={
                    <Tv />
                } />

                
            </Routes>
        </BrowserRouter>
    )
}