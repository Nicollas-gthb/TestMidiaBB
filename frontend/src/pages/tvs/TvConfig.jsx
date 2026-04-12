import "./TvConfig.css"
import { Aside } from "../../components/aside/Aside"

export default function TvConfig() {
    return (
        <div id="midia-container">

            <Aside />

            <main id="midia-main-container">

                {/** TODO: converter o header em um componente */}
                <header id="midia-menu-header">
                    <h1>LOGO</h1>
                </header>

                <div id="midia-menu-main">

                    <div className="table-title">

                        <h2>Gestão de TVs</h2>
        
                        <button 
                            className="action-button"
                            onClick={() => {
                                // setAddMidiaAberto(true)
                            }}
                        >
                            <i className="bi bi-arrow-bar-up"></i>
                            Nova TV
                        </button>

                    </div>

                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th className="left-table">ID</th>
                                    <th>NOME</th>
                                    <th>NUMERO</th>
                                    <th>MIDIAS</th>
                                    <th>STATUS</th>
                                    <th>URL</th>
                                    <th className="right-table">AÇÕES</th>
                                </tr>
                            </thead>
                            <tbody>
                                
                                <tr>
                                    <td colSpan={9} style={{ textAlign: "center" }}>
                                        Nenhuma tv cadastrada
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* {addMidiaAberto && (
                        <AddMidia 
                            onClose={() => setAddMidiaAberto(false)}
                            onSuccess={() => {
                                setAddMidiaAberto(false)
                                carregarMidias()
                            }}
                        />
                    )} */}
                </div>
            </main>
        </div>
    )
}