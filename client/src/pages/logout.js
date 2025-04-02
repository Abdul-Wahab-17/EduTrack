import axios from "axios";
import { useNavigate } from "react-router-dom";

function Logout({ setAuthenticated }) {  // Pass state updater from App.js
    const navigate = useNavigate();

    function handleLogout() {
        axios.post("http://localhost:8080/auth/logout", {}, { withCredentials: true })
            .then(() => {
                console.log("Logged out successfully");
                setAuthenticated(false); // Update global auth state
                navigate("/login"); // Redirect after logout
            })
            .catch(err => {
                console.error("Logout failed:", err);
            });
    }

    return (
        <>
            <p>Do you want to logout?</p><br />
            <button onClick={handleLogout}>Logout</button>
        </>
    );
}

export default Logout;
