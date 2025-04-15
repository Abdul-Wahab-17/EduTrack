import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = ({ setAuthenticated , setRole , setUsername }) => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        role: ""
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            await axios.post(
                "http://localhost:8080/auth/register",
                {
                    username: formData.username,
                    password: formData.password,
                    email: formData.email,
                    role: formData.role
                },
                { withCredentials: true }
            );

            setAuthenticated(true);
            setRole(formData.role);
            setUsername(formData.username);
            
            navigate("/dashboard");
        } catch (err) {
            const message =
                err?.response?.data
                "Registration failed";
            setError(message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md space-y-4">
            {error && (
                <div className="text-red-500 text-sm font-medium border border-red-300 bg-red-50 p-2 rounded">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-gray-700 font-medium mb-1">Username:</label>
                <input type="text" name="username" onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
            <div>
                <label className="block text-gray-700 font-medium mb-1">Password:</label>
                <input type="password" name="password" onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
            <div>
                <label className="block text-gray-700 font-medium mb-1">Confirm Password:</label>
                <input type="password" name="confirmPassword" onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
            <div>
                <label className="block text-gray-700 font-medium mb-1">Email:</label>
                <input type="email" name="email" onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
            <div>
                <label className="block text-gray-700 font-medium mb-2">Role:</label>
                <div className="flex items-center gap-4">
                    <label className="flex items-center space-x-2">
                        <input type="radio" name="role" value="student" onChange={handleChange} />
                        <span>Student</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input type="radio" name="role" value="instructor" onChange={handleChange} />
                        <span>Instructor</span>
                    </label>
                </div>
            </div>
            <div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">
                    Submit
                </button>
            </div>
        </form>
    );
};

export default Register;
