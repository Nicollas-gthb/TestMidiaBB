import "./LogoutButton.css"

export const LogoutButton = ({onClick}) => {

    return (
        <div id="component-logout">
            <button id="component-logout-button" onClick={onClick}>
                <i id="component-logout-icon" className="bi bi-box-arrow-right"></i>
                <p id="component-logout-text" >Log out</p>
            </button>
        </div>
    )
}