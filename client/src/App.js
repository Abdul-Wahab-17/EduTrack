import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/navbar';
import Home from './pages/home';
import Dashboard from './pages/dashboard';
import Login from './pages/login';
import Logout from './pages/logout';
import Footer from './components/footer';

function App() {
    const [isAuthenticated, setAuthenticated] = useState(false);

    // Check if user is authenticated when the app loads
    useEffect(() => {
        axios.get('http://localhost:8080/auth/check', { withCredentials: true })
            .then(res => {
                setAuthenticated(res.data.authenticated);
            })
            .catch(() => setAuthenticated(false)); // Handle errors by assuming not authenticated
    }, []);

    return (
        <BrowserRouter>
            <Navbar isAuthenticated={isAuthenticated} setAuthenticated={setAuthenticated} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<Login setAuthenticated={setAuthenticated} />} />
                <Route path="/logout" element={<Logout setAuthenticated={setAuthenticated} />} />
            </Routes>
            <Footer/>
        </BrowserRouter>
    );
}

export default App;
