import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    var username;

    useEffect(() => {
        axios.get('http://localhost:8080/auth/check', { withCredentials: true })
            .then((res) => {
                if (!res.data.authenticated) {
                    navigate("/login"); // Redirect to login if not authenticated
                } else {
                    username = res.data.user?.username;
                    setIsAuthenticated(true);
                }
            })
            .catch(() => navigate("/login")); // Redirect on error
    }, [navigate]);

    return isAuthenticated ? <h1>Welcome to the Dashboard {username} </h1> : null;
}

export default Dashboard;
