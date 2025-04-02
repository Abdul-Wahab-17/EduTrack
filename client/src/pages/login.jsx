import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login({setAuthenticated}) {

    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
           await axios.post("http://localhost:8080/auth/login", formData, {
                withCredentials: true, // Send session cookies
            });
            setAuthenticated(true);
            navigate("/dashboard");
        } catch (err) {
            setError("Invalid credentials");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <label>Username: </label>
                <input type="text" name="username" value={formData.username} onChange={handleChange} required />

                <label>Password: </label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />

                <button type="submit">Login</button>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default Login;
