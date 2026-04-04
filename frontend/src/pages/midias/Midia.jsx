import "./Midia.css"

export default function Midia() {
    return (
        <div id="home-container">

            {/** TODO: converter o aside em um componente */}
            <aside id="home-menu-container">
                <header id="home-aside-header">
                    <h1>Menu</h1>
                </header>
                <div id="home-aside-main">
                    <button>Botão 1</button>
                    <button>Botão 2</button>
                    <button>Botão 3</button>
                </div>
            </aside>


            <main id="home-main-container">

                {/** TODO: converter o header em um componente */}
                <header id="midia-menu-header">
                    <h1>LOGO</h1>
                </header>

                <div id="midia-menu-main">

                    <div className="table-title">

                        <h2>Gestão de midias</h2>
        
                        <button className="action-button">Nova midia</button>

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
                </div>
            </main>
        </div>
    )
}