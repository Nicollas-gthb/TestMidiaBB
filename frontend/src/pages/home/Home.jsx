import "./Home.css"

export default function Home() {
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
                
                </div>
            </main>
        </div>
    )
}