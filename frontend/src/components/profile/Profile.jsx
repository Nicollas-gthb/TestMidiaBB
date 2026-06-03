import "./Profile.css";

export const Profile = ({onClick, user}) => {

    return (
        <div id="component-profile-container">
            <button id="component-profile-btn" onClick={onClick}>
                <i className="bi bi-person-circle"></i>
                <p>{user}</p>
            </button>
        </div>
    )
}