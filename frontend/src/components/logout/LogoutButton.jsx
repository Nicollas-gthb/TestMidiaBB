import "./LogoutButton.css"

export const LogoutButton = ({onCLick}) => {

    return (
        <div id="component-logout">
            <button id="component-logout-button" onClick={onCLick}>
                <i id="component-logout-icon" className="bi bi-box-arrow-right"></i>
                <p id="component-logout-text" >Log out</p>
            </button>
        </div>
    )
}