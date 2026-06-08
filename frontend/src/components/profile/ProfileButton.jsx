import "./ProfileButton.css";

export const Profile = ({onClick, user}) => {

    return (
        
        <button   
            className="header-action profile-btn"
            onClick={onClick}
        >
            <i className="bi bi-person-circle"></i>
            <p>{user}</p>
        </button>
        
    )
}