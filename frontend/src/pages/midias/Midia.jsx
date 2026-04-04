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
                <header id="home-menu-header">
                    <h1>LOGO</h1>
                </header>

                <div id="home-menu-main">
                    <h1>Gestão de midias</h1>

                    <button>Nova midia</button>

                    <p>Lista de tvs</p>

                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>NOME</th>
                                    <th>TIPO</th>
                                    <th>STATUS</th>
                                    <th>TVS ASSOCIADAS</th>
                                    <th>VALIDADE</th>
                                    <th>URL</th>
                                    <th>AÇÕES</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>a</td>
                                    <td>a</td>
                                    <td>a</td>
                                    <td>a</td>
                                    <td>a</td>
                                    <td>a</td>
                                    <td>a</td>
                                    <td>a</td>
                                </tr>
                                <tr>
                                    <td>a</td>
                                    <td>a</td>
                                    <td>a</td>
                                    <td>a</td>
                                    <td>a</td>
                                    <td>a</td>
                                    <td>a</td>
                                    <td>a</td>
                                </tr>
                                <tr>
                                    <td>a</td>
                                    <td>a</td>
                                    <td>a</td>
                                    <td>a</td>
                                    <td>a</td>
                                    <td>a</td>
                                    <td>a</td>
                                    <td>a</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    )
}