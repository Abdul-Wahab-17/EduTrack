import axios from "axios";
import React ,{ useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = ( setAuthenticated) => {
    const [formData , setFormData] = useState( {username:"" , password:"" , email : "" , role:""});
    const [error ,setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/auth/register' , formData , { withCredentials:true}  );
            setAuthenticated(true);
            navigate("/dashboard");

        }
        catch (error) {
            setError(error);
        }
    }
    return (
        <>
            <form  onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Username:</label>
                    <input type="text" name="username" onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Password:</label>
                    <input type="password" name="password" onChange={handleChange}className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Email:</label>
                    <input type="email" name="email" onChange={handleChange}className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Role:</label>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center space-x-2">
                            <input type="radio" name="role" value="student" onChange={handleChange}className="form-radio text-blue-600" />
                            <span>Student</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input type="radio" name="role" value="instructor"onChange={handleChange} className="form-radio text-green-600" />
                            <span>Instructor</span>
                        </label>
                    </div>
                </div>
                <div>
                    <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">Submit</button>
                </div>
            </form>
           
        </>
    );
}

export default Register;