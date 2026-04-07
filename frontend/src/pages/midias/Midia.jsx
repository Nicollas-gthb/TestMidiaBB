import { useState } from "react"

import "./Midia.css"
import { AddMidia } from "../../components/midia/AddMidia"

export default function Midia() {

    const [addMidiaAberto, setAddMidiaAberto] = useState(false)

    return (
        <div id="midia-container">

            {/** TODO: converter o aside em um componente */}
            <aside id="midia-menu-container">
                <header id="midia-aside-header">
                    <h1>Menu</h1>
                </header>
                <div id="midia-aside-main">
                    <button>Botão 1</button>
                    <button>Botão 2</button>
                    <button>Botão 3</button>
                </div>
            </aside>


            <main id="midia-main-container">

                {/** TODO: converter o header em um componente */}
                <header id="midia-menu-header">
                    <h1>LOGO</h1>
                </header>

                <div id="midia-menu-main">

                    <div className="table-title">

                        <h2>Gestão de midias</h2>
        
                        <button 
                            className="action-button"
                            onClick={() => {setAddMidiaAberto(true)}}
                        >
                            <i className="bi bi-arrow-bar-up"></i>
                            Nova midia
                        </button>

                    </div>

                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th className="left-table">ID</th>
                                    <th>NOME</th>
                                    <th>TIPO</th>
                                    <th>STATUS</th>
                                    <th>TVS ASSOCIADAS</th>
                                    <th>VALIDADE</th>
                                    <th>URL</th>
                                    <th className="right-table">AÇÕES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {}
                            </tbody>
                        </table>
                    </div>

                    {addMidiaAberto && (
                        <AddMidia 
                            onClose={() => {setAddMidiaAberto(false)}}
                        />
                    )}
                </div>
            </main>
        </div>
    )
}