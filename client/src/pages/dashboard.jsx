import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Student from '../components/student';
import Instructor from "../components/instructor";
import Admin from "../components/Admin";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io(`http://localhost:8080`);

function Dashboard({ isAuthenticated, role, username, setAuthenticated, setRole, setUsername }) {
    const navigate = useNavigate();

    // Check authentication status and user role
    useEffect(() => {
        axios.get("http://localhost:8080/auth/check", { withCredentials: true })
            .then((res) => {
                setAuthenticated(res.data.authenticated);
                setRole(res.data.user.role);
                setUsername(res.data.user.username);

                // Emit socket registration after successfully checking authentication
                socket.emit('register', res.data.user.id);
            })
            .catch(err => {
                console.error(err);
            });
    }, [setAuthenticated, setRole, setUsername]);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    // Handle socket connection
    useEffect(() => {
        socket.on('connect', () => {
            console.log('User connected');
        });

        // Clean up socket listener on component unmount
        return () => {
            socket.off('connect');
        };
    }, []);

    let content;
    switch (role) {
        case 'student':
            content = <Student />;
            break;
        case 'instructor':
            content = <Instructor />;
            break;
        case 'admin':
            content = <Admin />;
            break;
        default:
            content = null;
    }

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <h1 className="text-3xl font-semibold text-gray-800">
                Welcome to the Dashboard, {username} <br />
            </h1>
            {content}
        </div>
    );
}

export default Dashboard;
