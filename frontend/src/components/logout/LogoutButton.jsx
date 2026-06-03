import "./LogoutButton.css"

export const LogoutButton = ({onClick}) => {

    return (
        
        <button 
            
            onClick={onClick}
            className="header-action logout-btn"
        >
            <i id="component-logout-icon" className="bi bi-box-arrow-right"></i>
            <p>Sair</p>
        </button>
        
    )
}