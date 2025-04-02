import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const [username , setUsername] = useState("");

    useEffect(() => {
        axios.get('http://localhost:8080/auth/check', { withCredentials: true })
            .then((res) => {
                if (!res.data.authenticated) {
                    navigate("/login"); // Redirect to login if not authenticated
                } else {
                    
                    setUsername(res.data.user.username)
                    setIsAuthenticated(true);
                }
            })
            .catch(() => navigate("/login")); // Redirect on error
    }, [navigate]);
    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <h1 className="text-3xl font-semibold text-gray-800">
                Welcome to the Dashboard, {username}
            </h1>
        </div>
    );
}

export default Dashboard;
